import { loginSchema, registrationSchema } from "../../modules/user/models";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { login, register, secondsInWeek } from "../../auth";

type ResultStatus = "Error" | "Success";

export const userRouter = router({
    accounts: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.user.findMany({ select: { email: true } });
    }),
    login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
        const tokens = await login({ email: input.email, password: input.password });

        if (tokens) {
            ctx.resHeaders.append("Set-Cookie", `accessToken=${tokens.accessToken}; Secure; SameSite=None; HttpOnly; Path=/; Max-Age=15`);
            ctx.resHeaders.append(
                "Set-Cookie",
                `refreshToken=${tokens.refreshToken}; Secure; SameSite=None; HttpOnly; Path=/; Max-Age=${secondsInWeek}`,
            );

            return { status: "Success" as ResultStatus };
        }

        return { status: "Error" as ResultStatus, message: "INVALID_USER_OR_PASSWORD" };
    }),
    register: publicProcedure.input(registrationSchema).mutation(async ({ input }) => {
        return register(input);
    }),
    logout: protectedProcedure.mutation(async ({ ctx }) => {
        await ctx.db.session.delete({ where: { id: ctx.session.sessionId } });

        ctx.resHeaders.append("Set-Cookie", `accessToken=; Secure; SameSite=None; HttpOnly; Path=/; Max-Age=0`);
        ctx.resHeaders.append("Set-Cookie", `refreshToken=; Secure; SameSite=None; HttpOnly; Path=/; Max-Age=0`);

        return { status: "Success" };
    }),
});

export type UserRouter = typeof userRouter;
