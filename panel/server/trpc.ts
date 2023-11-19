import type { inferAsyncReturnType } from "@trpc/server";
import { initTRPC, TRPCError } from "@trpc/server";
// import { initTRPC} from "@trpc/server";
// import type { Session } from "next-auth";
// import { getServerAuthSession } from "./auth";
// import { db } from "./db";
import superjson from "superjson";
// import { db } from "./db";
// import { getServerAuthSession } from "./auth";
// import { getSession } from "next-auth/react";
// import { PrismaClient } from "@prisma/client";
import { db } from "./db";
// import { getServerAuthSession } from "./auth";
import { parseCookies } from "@set/utils/dist/cookie";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import type { IncomingMessage } from "http";
import type ws from "ws";
import { getUserSession, secondsInWeek } from "../auth/index";

export const createContextWs = async (opts: NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => {
    const cookies = parseCookies(opts.req.headers.cookie ?? "");

    const session = await getUserSession(cookies);

    //cookies invalidation on existing ws connection

    return {
        session: session.payload,
        db,
    };
};

export const createContextNext = async (opts: FetchCreateContextFnOptions) => {
    const cookies = parseCookies(opts.req.headers.get("cookie") ?? "");

    const session = await getUserSession(cookies);

    // console.log(opts.resHeaders.set());

    // console.log(opts.resHeaders);

    if (session.accessToken) {
        // Set-Cookie: <cookie-name>=<cookie-value>; Max-Age=<number>
        opts.resHeaders.append("Set-Cookie", `accessToken=${session.accessToken}; HttpOnly Max-Age=15`);
    } else {
        // opts.resHeaders.delete("accessToken");
    }

    if (session.refreshToken) {
        opts.resHeaders.append("Set-Cookie", `refreshToken=${session.refreshToken}; HttpOnly Max-Age=${secondsInWeek}`);
        // opts.resHeaders.set("refreshToken", session.refreshToken);
    } else {
        // opts.resHeaders.delete("refreshToken");
    }

    return {
        session: session.payload,
        db,
    };
};

export type Context = inferAsyncReturnType<typeof createContextWs>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape;
    },
});

export const router = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthenticated = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.name) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            session: { ...ctx.session },
        },
    });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthenticated);
