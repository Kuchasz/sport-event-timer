import { sort } from "@set/utils/dist/array";
import { playerErrors } from "../../modules/player/errors";
import { z } from "zod";
import { playerPromotionSchema, racePlayerSchema } from "../../modules/player/models";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const stopwatchPlayersSchema = z.array(
    z.object({
        name: z.string(),
        lastName: z.string(),
        bibNumber: z.number(),
        startTime: z.number().optional(),
        classificationId: z.number(),
    }),
);

const promoteRegistrationSchema = z.object({
    raceId: z.number({ required_error: "raceId is required" }),
    registrationId: z.number({ required_error: "registrationId is required" }),
    player: playerPromotionSchema,
});

export const playerRouter = router({
    players: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const { raceId } = input;
            const players = await ctx.db.player.findMany({
                where: { raceId: raceId },
                include: { classification: true, profile: true },
            });

            return players.map((p, index) => ({ ...p.profile, ...p, index: index + 1 }));
        }),
    lastAvailableStartTime: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const { raceId } = input;

            const lastStartingPlayer = await ctx.db.player.findFirst({ where: { raceId }, orderBy: { startTime: "desc" } });

            return (lastStartingPlayer?.startTime ?? 0) + 60 * 1_000;
        }),
    lastAvailableBibNumber: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const { raceId } = input;

            const playersBibNumbers = await ctx.db.player.findMany({ where: { raceId } });
            const bibNumbers = await ctx.db.bibNumber.findMany({ where: { raceId }, orderBy: { number: "asc" } });

            const usedBibNumbers = new Set(playersBibNumbers.filter(p => !!p.bibNumber).map(p => p.bibNumber));

            const sortedBibNumbers = sort(bibNumbers, b => Number(b.number));

            return sortedBibNumbers.find(b => !usedBibNumbers.has(b.number))?.number ?? "";
        }),
    stopwatchPlayers: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .output(stopwatchPlayersSchema)
        .query(async ({ input, ctx }) => {
            const { raceId } = input;
            const players = await ctx.db.player.findMany({
                where: { raceId: raceId },
                select: {
                    profile: {
                        select: {
                            name: true,
                            lastName: true,
                        },
                    },
                    bibNumber: true,
                    startTime: true,
                    classificationId: true,
                },
            });
            return players.map(p => ({ ...p.profile, ...p, bibNumber: Number(p.bibNumber) })) as z.TypeOf<typeof stopwatchPlayersSchema>;
        }),
    startList: publicProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const { raceId } = input;
            const race = await ctx.db.race.findFirstOrThrow({ where: { id: raceId } });
            const playersWithTimes = await ctx.db.player.findMany({
                where: { raceId: raceId },
                select: {
                    profile: {
                        select: {
                            name: true,
                            lastName: true,
                        },
                    },
                    bibNumber: true,
                    startTime: true,
                },
            });

            if (playersWithTimes.some(p => !p.startTime)) throw playerErrors.PLAYER_WITHOUT_START_TIME_EXISTS;

            return playersWithTimes.map(p => ({
                name: p.profile.name,
                lastName: p.profile.lastName,
                bibNumber: p.bibNumber,
                absoluteStartTime: race.date.getTime() + p.startTime!,
            }));
        }),
    delete: protectedProcedure.input(z.object({ playerId: z.number() })).mutation(async ({ input, ctx }) => {
        const player = await ctx.db.player.findFirstOrThrow({ where: { id: input.playerId } });

        await ctx.db.splitTime.deleteMany({ where: { player } });
        await ctx.db.manualSplitTime.deleteMany({ where: { player } });
        await ctx.db.absence.deleteMany({ where: { player } });

        return await ctx.db.player.delete({ where: { id: input.playerId } });
    }),
    promoteRegistration: protectedProcedure.input(promoteRegistrationSchema).mutation(async ({ input, ctx }) => {
        const { player } = input;

        const playerWithTheSameTime = player.startTime
            ? await ctx.db.player.findFirst({
                  where: {
                      raceId: input.raceId,
                      OR: [{ startTime: player.startTime }, { bibNumber: player.bibNumber }],
                  },
              })
            : null;

        const playerWithTheSameBibNumber = player.bibNumber
            ? await ctx.db.player.findFirst({
                  where: {
                      raceId: input.raceId,
                      bibNumber: player.bibNumber,
                  },
              })
            : null;

        if (playerWithTheSameBibNumber) throw playerErrors.BIB_NUMBER_ALREADY_TAKEN;
        if (playerWithTheSameTime) throw playerErrors.START_TIME_ALREADY_TAKEN;

        const registration = await ctx.db.playerRegistration.findUniqueOrThrow({ where: { id: input.registrationId } });
        const classification = await ctx.db.classification.findUniqueOrThrow({
            where: { id: player.classificationId, race: { id: input.raceId } },
            include: { race: true },
        });

        const playerAlreadyPromoted = await ctx.db.player.findFirst({
            where: {
                playerRegistrationId: registration.id,
            },
        });

        if (playerAlreadyPromoted) throw playerErrors.REGISTRATION_ALREADY_PROMOTED;

        const session = await ctx.db.session.findUniqueOrThrow({ where: { id: ctx.session.sessionId } });

        return await ctx.db.player.create({
            data: {
                ...player,
                raceId: registration.raceId,
                playerProfileId: registration.playerProfileId,
                classificationId: classification.id,
                promotedByUserId: session.userId,
                playerRegistrationId: registration.id,
            },
        });
    }),
    edit: protectedProcedure.input(racePlayerSchema).mutation(async ({ input, ctx }) => {
        const { player } = input;

        const classification = await ctx.db.classification.findUniqueOrThrow({
            where: { id: input.player.classificationId, race: { id: input.raceId } },
            include: { race: true },
        });

        const otherPlayerWithTheSameTime = player.startTime
            ? await ctx.db.player.findFirst({
                  where: {
                      raceId: input.raceId,
                      OR: [{ startTime: player.startTime }, { bibNumber: player.bibNumber }],
                      NOT: {
                          id: player.id!,
                      },
                  },
              })
            : null;

        const otherPlayerWithTheSameBibNumber = player.bibNumber
            ? await ctx.db.player.findFirst({
                  where: {
                      raceId: input.raceId,
                      bibNumber: player.bibNumber,
                      NOT: {
                          id: player.id!,
                      },
                  },
              })
            : null;

        if (otherPlayerWithTheSameBibNumber) throw playerErrors.BIB_NUMBER_ALREADY_TAKEN;
        if (otherPlayerWithTheSameTime) throw playerErrors.START_TIME_ALREADY_TAKEN;

        return await ctx.db.player.update({
            where: { id: player.id! },
            data: {
                bibNumber: player.bibNumber,
                startTime: player.startTime,
                classificationId: classification.id,
            },
        });
    }),
    totalPlayers: protectedProcedure.input(z.object({ raceId: z.number() })).query(async ({ input, ctx }) => {
        return await ctx.db.player.count({ where: { raceId: input.raceId } });
    }),
});

export type PlayerRouter = typeof playerRouter;
