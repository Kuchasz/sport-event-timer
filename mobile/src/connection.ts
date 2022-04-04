import { io, Socket } from "socket.io-client";

export const hubUrl =
    process.env.NODE_ENV === "production" ? "https://wss.set-hub.pyszstudio.pl" : "http://localhost:21822";

export const wsHubUrl =
    process.env.NODE_ENV === "production" ? "wss://wss.set-hub.pyszstudio.pl" : "ws://localhost:21822";

let socket: ReturnType<typeof io>;

export const getConnection = () => {
    if (!socket) {
        socket = io(hubUrl, { transports: ["websocket"] });
        registerStateChangeHandlers(socket);
    }

    return socket;
};

export type ConnectionState = "connected" | "reconnecting" | "disconnected" | "error";

type ConnectionStateHandler = (s: ConnectionState) => void;
const onStateChangedHandlers = [] as ConnectionStateHandler[];
export const onConnectionStateChanged = (handler: ConnectionStateHandler) => {
    onStateChangedHandlers.push(handler);
    return () => {
        onStateChangedHandlers.splice(onStateChangedHandlers.indexOf(handler), 1);
    };
}; //possible memory leaks

const runStateChangedHandlers = (s: ConnectionState) => {
    onStateChangedHandlers.forEach((x) => x(s));
};

const registerStateChangeHandlers = (socket: Socket) => {
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

    socket.io.on("reconnect", () => {
        runStateChangedHandlers("connected");
    });

    socket.io.on("reconnect_error", () => {
        runStateChangedHandlers("reconnecting");
    });

    socket.io.on("reconnect_attempt", () => {
        runStateChangedHandlers("reconnecting");
    });

    socket.io.on("reconnect_failed", () => {
        runStateChangedHandlers("disconnected");
    });
};
