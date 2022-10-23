import type { inferAsyncReturnType } from "@trpc/server";
import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { Session } from "next-auth";
import { getServerAuthSession } from "./auth";
import { db } from "./db";
import superjson from "superjson";

type CreateContextOptions = {
    session: Session | null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
    return {
        session: opts.session,
        db,
    };
};

export const createContext = async (opts: CreateNextContextOptions) => {
    const { req, res } = opts;

    const session = await getServerAuthSession({ req, res });

    return await createContextInner({
        session,
    });
};

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape;
    },
});

export const router = t.router;

export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
    // if (!ctx.session || !ctx.session.user) {
    //     throw new TRPCError({ code: "UNAUTHORIZED" });
    // }
    // return next({
    //     ctx: {
    //         session: { ...ctx.session, user: ctx.session.user },
    //     },
    // });
    return next();
});

export const protectedProcedure = t.procedure.use(isAuthed);

