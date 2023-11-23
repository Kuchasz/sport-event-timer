import { createContextWs } from "./trpc";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import fetch from "node-fetch";
import { WebSocketServer } from "ws";
import { appRouter } from "./routers/app";
import("../env");
import { env } from "../env";

if (!global.fetch) {
    console.log('path.resolve(".env")');
    (global as any).fetch = fetch;
}

const wss = new WebSocketServer({
    port: env.NEXT_PUBLIC_APP_WS_PORT,
});

const handler = applyWSSHandler({ wss, router: appRouter, createContext: createContextWs });

wss.on("connection", ws => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once("close", () => {
        console.log(`➖➖ Connection (${wss.clients.size})`);
    });
});

console.log(`✅ WebSocket Server listening on ws://${env.NEXT_PUBLIC_APP_URL}:${env.NEXT_PUBLIC_APP_WS_PORT}`);

process.on("SIGTERM", () => {
    console.log("SIGTERM");
    handler.broadcastReconnectNotification();
    wss.close();
});
