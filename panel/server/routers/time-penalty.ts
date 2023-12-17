import { timePenaltySchema } from "../../modules/time-penalty/models";
import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const timePenaltyRouter = router({
    allPenalties: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;

            const players = await ctx.db.player.findMany({ where: { raceId }, include: { profile: true } });
            const playersByBibNumbers = new Map<string, string>(players.map(p => [p.bibNumber, `${p.profile.name} ${p.profile.lastName}`]));
            const penalties = await ctx.db.timePenalty.findMany({ where: { raceId } });

            return penalties.map(p => ({ ...p, player: playersByBibNumbers.get(p.bibNumber) }));
        }),
    penalties: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;
            const timePenalties = await ctx.db.timePenalty.findMany({ where: { raceId } });
            return Object.fromEntries(timePenalties.map(tp => [tp.bibNumber, tp.id])) as Record<string, number>;
        }),
    playerPenalties: protectedProcedure
        .input(
            z.object({
                bibNumber: z.string({ required_error: "bibNumber is required" }),
                raceId: z.number({ required_error: "raceId is required" }),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { raceId, bibNumber } = input;
            const timePenalties = await ctx.db.timePenalty.findMany({ where: { raceId, bibNumber } });
            return timePenalties.map(tp => ({ key: tp.bibNumber, id: tp.id, time: tp.time, reason: tp.reason }));
        }),
    applyPenalty: protectedProcedure.input(timePenaltySchema).mutation(async ({ input, ctx }) => {
        const { id: _id, ...timePenalty } = input;

        return await ctx.db.timePenalty.create({ data: timePenalty });
    }),
    update: protectedProcedure.input(timePenaltySchema).mutation(async ({ input, ctx }) => {
        const { id, ...timePenalty } = input;

        return await ctx.db.timePenalty.update({ where: { id: id! }, data: timePenalty });
    }),
    revert: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
        const { id } = input;
        return await ctx.db.timePenalty.delete({
            where: {
                id,
            },
        });
    }),
});

export type TimePenaltyRouter = typeof timePenaltyRouter;
