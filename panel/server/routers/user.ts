import { loginSchema, registrationSchema } from "modules/user/models";
import { protectedProcedure, publicProcedure, router } from "../trpc";

type ResultStatus = "Error" | "Success";

export const userRouter = router({
    accounts: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.user.findMany({ select: { email: true } });
    }),
    login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
        const user = await ctx.db.user.findUnique({ where: { email: input.email } });

        if (!user) return { status: "Error" as ResultStatus, message: "INVALID_USER_OR_PASSWORD" };

        if (user.password === input.password) return { status: "Success" as ResultStatus };

        return { status: "Error" as ResultStatus, message: "INVALID_USER_OR_PASSWORD" };
    }),
    register: publicProcedure.input(registrationSchema).mutation(async ({ ctx, input }) => {
        const user = await ctx.db.user.findUnique({ where: { email: input.email } });

        if (!user) return { status: "Error" as ResultStatus, message: "INVALID_USER_OR_PASSWORD" };

        if (user.password === input.password) return { status: "Success" as ResultStatus };

        return { status: "Error" as ResultStatus, message: "INVALID_USER_OR_PASSWORD" };
    }),
});

export type UserRouter = typeof userRouter;
