import type { inferAsyncReturnType } from "@trpc/server";
import { initTRPC, TRPCError } from "@trpc/server";
// import { initTRPC} from "@trpc/server";
// import type { Session } from "next-auth";
// import { getServerAuthSession } from "./auth";
// import { db } from "./db";
import superjson from "superjson";
// import { db } from "./db";
// import { getServerAuthSession } from "./auth";
import { getServerSession } from "next-auth";
// import { getSession } from "next-auth/react";
// import { PrismaClient } from "@prisma/client";
import { db } from "./db";
// import { getServerAuthSession } from "./auth";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { authOptions } from "./auth";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import { IncomingMessage } from "http";
import ws from "ws";
import { getSession } from "next-auth/react";

export const createContext =
    (forWS: boolean) => async (opts: FetchCreateContextFnOptions | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => {
        // export const createContext = async (opts: CreateNextContextOptions) => {
        // const { req, res } = opts;

        // req.headers.cookie

        // console.log(a, b);

        // console.log(opts);
        // opts.req.
        // Get the session from the server using the unstable_getServerSession wrapper function
        // const session = await getServerAuthSession({ req: opts.req, res: opts.res });
        // const session = await getSession(opts as any);

        // const req = {
        //     headers: Object.fromEntries(headers()),
        //     cookies: Object.fromEntries(
        //       cookies()
        //         .getAll()
        //         .map(c => [c.name, c.value]),
        //     ),
        //   } as any;
        //   const res = {
        //     getHeader() {
        //       /* empty */
        //     },
        //     setCookie() {
        //       /* empty */
        //     },
        //     setHeader() {
        //       /* empty */
        //     },
        //   } as any;
        //| NodeHTTPCreateContextFnOptions<IncomingMessage, ws>

        // console.log(opts.res);

        // console.log('forWS', forWS);

        const sessionPromise = forWS
            ? getSession(opts as NodeHTTPCreateContextFnOptions<IncomingMessage, ws>)
            : getServerSession(authOptions());

        return {
            session: await sessionPromise,
            db,
        };
    };

export type Context = inferAsyncReturnType<ReturnType<typeof createContext>>;

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
