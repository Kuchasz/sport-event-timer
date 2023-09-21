import { protectedProcedure, publicProcedure, router } from "../trpc"
import { z } from "zod";
import { createExampleRaces } from "../example-races";
import { TRPCError } from "@trpc/server";

const raceSchema = z.object({
    id: z.number().min(1).nullish(),
    name: z.string({ required_error: "name is required" }),
    date: z.date({ required_error: "date is required" }),
    termsUrl: z.string().nullish(),
    emailTemplate: z.string().nullish(),
    playersLimit: z.number().int().positive().nullish(),
    registrationEnabled: z.boolean(),
    useSampleData: z.boolean().nullish()
});

export const raceRouter =
    router({
        basicInfo: publicProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async ({ input, ctx }) => {
                const id = input.raceId;
                return await ctx.db.race.findUnique({ where: { id }, select: { name: true, date: true } });
            }),
        races: protectedProcedure
            .query(async ({ ctx }) => {
                const racesWithRegistrations = await ctx.db.race.findMany({ include: { playerRegistration: true } });
                return racesWithRegistrations.map(r => ({
                    id: r.id,
                    name: r.name,
                    date: r.date,
                    emailTemplate: r.emailTemplate,
                    termsUrl: r.termsUrl,
                    playersLimit: r.playersLimit,
                    registrationEnabled: r.registrationEnabled,
                    registeredPlayers: r.playerRegistration.length
                }));
            }),
        raport: protectedProcedure
            .query(async ({ ctx }) => {
                const totalRaces = await ctx.db.race.count();
                const pastRaces = await ctx.db.race.count({ where: { date: { lte: new Date() } } });
                const futureRaces = await ctx.db.race.count({ where: { date: { gte: new Date() } } });
                const nextRace = await ctx.db.race.findFirst({ where: { date: { gte: new Date() } }, orderBy: { date: 'asc' }, include: { playerRegistration: true, player: true } });
                return {
                    totalRaces,
                    pastRaces,
                    futureRaces,
                    nextRace: {
                        name: nextRace?.name,
                        registeredPlayers: nextRace?.playerRegistration.length,
                        players: nextRace?.player.length,
                        playersLimit: nextRace?.playersLimit,
                        date: nextRace?.date,
                        registrationEnabled: nextRace?.registrationEnabled
                    }
                };
            }),
        myRaces: protectedProcedure
            .query(async ({ ctx }) => {
                return await ctx.db.race.findMany({ orderBy: { id: "desc" } });
            }),
        race: protectedProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async ({ input, ctx }) => {
                const id = input.raceId;
                return await ctx.db.race.findUnique({ where: { id } });
            }),
        raceRaport: protectedProcedure
            .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
            .query(async ({ input, ctx }) => {
                const { raceId } = input;

                const race = await ctx.db.race.findFirstOrThrow({ where: { id: raceId }, include: { playerRegistration: true, player: true } });

                return {
                    name: race.name,
                    registeredPlayers: race.playerRegistration.length,
                    players: race.player.length,
                    playersLimit: race.playersLimit,
                    date: race.date,
                    registrationEnabled: race.registrationEnabled

                };
            }),
        delete: protectedProcedure
            .input(z.object({
                raceId: z.number()
            }))
            .mutation(async ({ input, ctx }) => {
                const numberOfRaces = await ctx.db.race.count();
                if (numberOfRaces <= 1)
                    throw new TRPCError({
                        code: 'BAD_REQUEST',
                        message: 'At least one race must exist'
                    });

                await ctx.db.absence.deleteMany({ where: { raceId: input.raceId } });;
                await ctx.db.splitTime.deleteMany({ where: { raceId: input.raceId } });;
                await ctx.db.manualSplitTime.deleteMany({ where: { raceId: input.raceId } });;
                await ctx.db.apiKey.deleteMany({ where: { raceId: input.raceId } });;
                await ctx.db.bibNumber.deleteMany({ where: { raceId: input.raceId } });;

                await ctx.db.player.deleteMany({ where: { raceId: input.raceId } });;
                await ctx.db.playerRegistration.deleteMany({ where: { raceId: input.raceId } });;
                await ctx.db.playerProfile.deleteMany({ where: { raceId: input.raceId } });;

                await ctx.db.classification.deleteMany({ where: { raceId: input.raceId } });

                await ctx.db.stopwatch.delete({ where: { raceId: input.raceId } });

                await ctx.db.timingPointAccessUrl.deleteMany({ where: { raceId: input.raceId } });
                await ctx.db.timingPointOrder.deleteMany({ where: { raceId: input.raceId } });
                await ctx.db.timingPoint.deleteMany({ where: { raceId: input.raceId } });

                return await ctx.db.race.delete({ where: { id: input.raceId } });
            }),
        update: protectedProcedure
            .input(raceSchema)
            .mutation(async ({ input, ctx }) => {
                const { id, ...data } = input;

                return await ctx.db.race.update({ where: { id: id! }, data });
            }),
        setRegistrationStatus: protectedProcedure
            .input(z.object({
                id: z.number({ required_error: "raceId is required" }),
                registrationEnabled: z.boolean()
            }))
            .mutation(async ({ input, ctx }) => {
                const { id, ...data } = input;
                return await ctx.db.race.update({ where: { id: id! }, data: { registrationEnabled: data.registrationEnabled } });
            }),
        add: protectedProcedure
            .input(raceSchema)
            .mutation(async ({ input, ctx }) => {
                const { id, useSampleData, ...data } = input;

                if (useSampleData) {
                    const user = await ctx.db.user.findFirstOrThrow({ where: { email: ctx.session.user.email! } });
                    createExampleRaces(user.id, 1, data);
                } else {
                    const race = await ctx.db.race.create({ data });

                    const timingPointsToCreate = [{
                        name: "Start",
                        description: "Where the players start",
                        raceId: race.id
                    }, {
                        name: "Finish",
                        description: "Where the players finish",
                        raceId: race.id
                    }].map(tp => ctx.db.timingPoint.create({ data: tp }));

                    const timingPoints = await ctx.db.$transaction(timingPointsToCreate);

                    await ctx.db.classification.create({ data: { raceId: race.id, name: "Base" } });

                    await ctx.db.timingPointOrder.create({ data: { raceId: race.id, order: JSON.stringify(timingPoints.map(tp => tp.id)) } })
                }
            })
    });

export type RaceRouter = typeof raceRouter;
