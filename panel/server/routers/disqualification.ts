import { protectedProcedure, router } from "../trpc";
import { z } from "zod";

const disqualificationSchema = z.object({
    id: z.number(),
    raceId: z.number(),
    bibNumber: z.string(),
    reason: z.string(),
});

export const disqualificationRouter = router({
    disqualifications: protectedProcedure
        .input(z.object({ raceId: z.number({ required_error: "raceId is required" }) }))
        .query(async ({ input, ctx }) => {
            const raceId = input.raceId;

            return await ctx.db.disqualification.findMany({ where: { raceId } });
        }),
    disqualify: protectedProcedure.input(disqualificationSchema).mutation(async ({ input, ctx }) => {
        const { ...disqualification } = input;

        return await ctx.db.disqualification.create({ data: disqualification });
    }),
    update: protectedProcedure.input(disqualificationSchema).mutation(async ({ input, ctx }) => {
        const { ...disqualification } = input;

        return await ctx.db.disqualification.update({ where: { id: disqualification.id }, data: disqualification });
    }),
    revert: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
        const { id } = input;

        return await ctx.db.disqualification.delete({
            where: { id },
        });
    }),
});

export type DisqualificationRouter = typeof disqualificationRouter;
