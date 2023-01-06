import { protectedProcedure, router } from "../trpc";
import { db } from "../db";

export const accountRouter =
    router({
        accounts: protectedProcedure
            .query(async () => {
                return await db.user.findMany({ select: { email: true } })
            })
    });

export type AccountRouter = typeof accountRouter;
