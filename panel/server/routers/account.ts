import { protectedProcedure, router } from "../trpc";

export const accountRouter = router({
    accounts: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.user.findMany({ select: { email: true } });
    }),
});

export type AccountRouter = typeof accountRouter;
