import type { inferAsyncReturnType } from "@trpc/server";
import { initTRPC, TRPCError } from "@trpc/server";
// import { initTRPC} from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
// import type { Session } from "next-auth";
// import { getServerAuthSession } from "./auth";
// import { db } from "./db";
import superjson from "superjson";
// import { db } from "./db";
// import { getServerAuthSession } from "./auth";
import { Session } from "next-auth";
// import { getSession } from "next-auth/react";
// import { PrismaClient } from "@prisma/client";
import { db } from "./db";
import { getServerAuthSession } from "./auth";

type CreateContextOptions = {
    session: Session | null;
};

export const createContextInner = async ({ session }: CreateContextOptions) => ({
    session,
    db
});

export const createContext = async (
    opts:
        | CreateNextContextOptions
    // | NodeHTTPCreateContextFnOptions<IncomingMessage , ws>
) => {
    // export const createContext = async (opts: CreateNextContextOptions) => {
    // const { req, res } = opts;

    // req.headers.cookie

    // Get the session from the server using the unstable_getServerSession wrapper function
    const session = await getServerAuthSession({ req: opts.req, res: opts.res });

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

const enforceUserIsAuthenticated = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthenticated);

