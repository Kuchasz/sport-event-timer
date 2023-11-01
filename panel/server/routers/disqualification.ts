import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

export const disqualificationRouter = router({
    disqualifications: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;

            return await ctx.db.disqualification.findMany({ where: { raceId } });
        }),
    disqualify: protectedProcedure
        .input(
            z.object({
                raceId: z.number(),
                bibNumber: z.string(),
                reason: z.string(),
            }),
        )
        .mutation(async ({ input, ctx }) => {
            const { ...timePenalty } = input;

            return await ctx.db.disqualification.create({ data: timePenalty });
        }),
    revert: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
        const { id } = input;

        return await ctx.db.disqualification.delete({
            where: { id },
        });
    }),
});

export type DisqualificationRouter = typeof disqualificationRouter;
