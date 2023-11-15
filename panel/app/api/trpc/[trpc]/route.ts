import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "server/routers/app";
import { createContextNext } from "../../../../server/trpc";

const handler = (request: Request) => {
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        batching: {
            enabled: true,
        },
        createContext: createContextNext,
    });
};

export const GET = handler;
export const POST = handler;
