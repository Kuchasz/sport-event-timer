import { parseCookies } from "@set/utils/dist/cookie";
import type { inferAsyncReturnType } from "@trpc/server";
import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import type { IncomingMessage } from "http";
import { DomainError, sharedErrors } from "modules/shared/errors";
import superjson from "superjson";
import type ws from "ws";
import { getUserSession } from "../auth/index";
import { db } from "./db";

export const createContextWs = async (opts: NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => {
    const cookies = parseCookies(opts.req.headers.cookie ?? "");

    const session = await getUserSession(cookies);

    //cookies invalidation on existing ws connection

    return {
        session: session.payload,
        db,
        resHeaders: undefined as unknown as Headers,
    };
};

export const createContextNext = async (opts: FetchCreateContextFnOptions) => {
    const cookies = parseCookies(opts.req.headers.get("cookie") ?? "");

    const session = await getUserSession(cookies);

    if (session.accessToken) {
        // && session.refreshToken) {
        opts.resHeaders.append("Set-Cookie", `accessToken=${session.accessToken}; Secure; HttpOnly; Path=/; Max-Age=15`);
        // opts.resHeaders.append("Set-Cookie", `refreshToken=${session.refreshToken}; HttpOnly Max-Age=${secondsInWeek}`);
    }
    // else {
    //     opts.resHeaders.append("Set-Cookie", `accessToken=${session.accessToken}; HttpOnly Max-Age=0`);
    //     opts.resHeaders.append("Set-Cookie", `refreshToken=${session.refreshToken}; HttpOnly Max-Age=0`);
    // }

    return {
        session: session.payload,
        db,
        resHeaders: opts.resHeaders,
    };
};

export type Context = inferAsyncReturnType<typeof createContextWs>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                domainErrorKey: error.code === "BAD_REQUEST" && error.cause instanceof DomainError ? error.cause.messageKey : null,
            },
        };
    },
});

export const router = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthenticated = t.middleware(({ ctx, next }) => {
    if (!ctx.session?.name) {
        throw sharedErrors.UNAUTHORIZED;
    }
    return next({
        ctx: {
            session: { ...ctx.session },
        },
    });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthenticated);
