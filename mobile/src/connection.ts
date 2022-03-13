import { io as ioClient } from "socket.io-client";

const io = (
    process.env.NODE_ENV === "production" ? require("socket.io-client/dist/socket.io") : require("socket.io-client")
) as typeof ioClient;

export const hubUrl =
    process.env.NODE_ENV === "production" ? "https://wss.set-hub.pyszstudio.pl" : "http://localhost:21822";

export const wsHubUrl =
    process.env.NODE_ENV === "production" ? "wss://wss.set-hub.pyszstudio.pl" : "ws://localhost:21822";
export const socket = io(hubUrl, { transports: ["websocket"] });

export type ConnectionState = "connected" | "reconnecting" | "disconnected" | "error";

type ConnectionStateHandler = (s: ConnectionState) => void;
const onStateChangedHandlers = [] as ConnectionStateHandler[];
export const onConnectionStateChanged = (handler: ConnectionStateHandler) => {
    onStateChangedHandlers.push(handler);
    return () => {
        onStateChangedHandlers.splice(onStateChangedHandlers.indexOf(handler), 1);
    };
}; //possible memory leaks

const runStateChangedHandlers = (s: ConnectionState) => onStateChangedHandlers.forEach((x) => x(s));

socket.on("connect", () => {
    runStateChangedHandlers("connected");
});

socket.on("disconnect", (r) => {
    runStateChangedHandlers("disconnected");
});

socket.on("connect_failed", () => {
    runStateChangedHandlers("disconnected");
});

socket.io.on("error", () => {
    runStateChangedHandlers("error");
});

socket.io.on("reconnect", (attempt) => {
    runStateChangedHandlers("connected");
});

socket.io.on("reconnect_error", (error) => {
    runStateChangedHandlers("reconnecting");
});

socket.io.on("reconnect_attempt", (attempt) => {
    runStateChangedHandlers("reconnecting");
});

socket.io.on("reconnect_failed", () => {
    runStateChangedHandlers("disconnected");
});
