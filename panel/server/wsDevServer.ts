import * as dotenv from "dotenv";
import { createContext } from "./trpc";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import fetch from "node-fetch";
import ws from "ws";
import { appRouter } from "./routers/app";

dotenv.config();

if (!global.fetch) {
    console.log('path.resolve(".env")');
    (global as any).fetch = fetch;
}

const wss = new ws.Server({
    port: 3001,
});

const handler = applyWSSHandler({ wss, router: appRouter, createContext: createContext(true) });

wss.on("connection", ws => {
    console.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once("close", () => {
        console.log(`➖➖ Connection (${wss.clients.size})`);
    });
});

console.log("✅ WebSocket Server listening on ws://localhost:3001");

process.on("SIGTERM", () => {
    console.log("SIGTERM");
    handler.broadcastReconnectNotification();
    wss.close();
});
