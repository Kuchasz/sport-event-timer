import { parseCookies } from "@set/utils/dist/cookie";
import type { inferAsyncReturnType } from "@trpc/server";
import { initTRPC } from "@trpc/server";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";
import type { IncomingMessage } from "http";
import { DomainError, sharedErrors } from "../modules/shared/errors";
import NodeCache from "node-cache";
import superjson from "superjson";
import type ws from "ws";
import { getUserSession } from "../auth/index";
import { db } from "./db";
import { type CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import { env } from "../env";

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

    const domain = env.NEXT_PUBLIC_NODE_ENV === "production" ? "Domain=rura.cc;" : "";

    if (session.accessToken) {
        opts.resHeaders.append(
            "Set-Cookie",
            `accessToken=${session.accessToken}; Secure; ${domain} SameSite=None; HttpOnly; Path=/; Max-Age=15`,
        );
    }

    return {
        session: session.payload,
        db,
        resHeaders: opts.resHeaders,
    };
};

export const createContextStandalone = async (opts: CreateHTTPContextOptions) => {
    const cookies = parseCookies(opts.req.headers.cookie ?? "");

    const session = await getUserSession(cookies);

    const domain = env.NEXT_PUBLIC_NODE_ENV === "production" ? "Domain=rura.cc;" : "";

    if (session.accessToken) {
        opts.res.setHeader(
            "Set-Cookie",
            `accessToken=${session.accessToken}; Secure; ${domain} SameSite=None; HttpOnly; Path=/; Max-Age=15`,
        );
    }

    return {
        session: session.payload,

        db,
        resHeaders: {
            append: (header: string, headerValue: string) => {
                const existingHeaders = opts.res.getHeader(header);

                if (!existingHeaders) {
                    opts.res.setHeader(header, headerValue);
                    return;
                }

                if (Array.isArray(existingHeaders)) {
                    opts.res.setHeader(header, [...existingHeaders, headerValue]);
                    return;
                }

                if (typeof existingHeaders === "string") {
                    opts.res.setHeader(header, [existingHeaders, headerValue]);
                    return;
                }
            },
        } as Headers,
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

const cacheSingleton = new NodeCache();

// A map of cached procedure names to a callable that gives a TTL in seconds
const cachedProcedures: Map<string, (() => number) | undefined> = new Map<string, (() => number) | undefined>();
cachedProcedures.set("result.results", () => 10); // 10 seconds

const middlewareMarker = "middlewareMarker" as "middlewareMarker" & {
    __brand: "middlewareMarker";
};

export const cacheMiddleware = t.middleware(async ({ ctx, next, path, type, getRawInput }) => {
    const rawInput = await getRawInput();

    if (type !== "query" || !cachedProcedures.has(path)) {
        return next();
    }
    let key = path;
    if (rawInput) {
        key += JSON.stringify(rawInput).replace(/\"/g, "'");
    }
    const cachedData = cacheSingleton.get(key);
    if (cachedData) {
        return {
            ok: true,
            data: cachedData,
            ctx,
            marker: middlewareMarker,
        };
    }
    const result = await next();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // data is not defined in the type MiddlewareResult
    const dataCopy = structuredClone(result.data);

    const ttlSecondsCallable = cachedProcedures.get(path);
    if (ttlSecondsCallable) {
        cacheSingleton.set(key, dataCopy, ttlSecondsCallable());
    } else {
        cacheSingleton.set(key, dataCopy);
    }
    return result;
});
