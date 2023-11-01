import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

const timePenaltySchema = z.object({
    id: z.number(),
    raceId: z.number(),
    bibNumber: z.string(),
    time: z.number(),
    reason: z.string(),
});

export const timePenaltyRouter = router({
    penalties: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;

            return await ctx.db.timePenalty.findMany({ where: { raceId } });
        }),
    addPenalty: protectedProcedure.input(timePenaltySchema).mutation(async ({ input, ctx }) => {
        const { ...timePenalty } = input;

        return await ctx.db.timePenalty.create({ data: timePenalty });
    }),
    update: protectedProcedure.input(timePenaltySchema).mutation(async ({ input, ctx }) => {
        const { ...timePenalty } = input;

        return await ctx.db.timePenalty.update({ where: { id: timePenalty.id }, data: timePenalty });
    }),
    revert: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
        const { id } = input;

        return await ctx.db.timePenalty.delete({
            where: { id },
        });
    }),
});

export type TimePenaltyRouter = typeof timePenaltyRouter;
