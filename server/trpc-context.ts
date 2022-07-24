import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import ws from "ws";
import { IncomingMessage } from "http";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/adapters/node-http";

export const createContext = ({
    req,
    res
}: trpcExpress.CreateExpressContextOptions | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => ({}); // empty context
type Context = trpc.inferAsyncReturnType<typeof createContext>;
