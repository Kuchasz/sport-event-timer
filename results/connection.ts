export const hubUrl =
    process.env.NODE_ENV === "production" ? "https://wss.set-hub.pyszstudio.pl" : "http://localhost:21822";

export const wsHubUrl =
    process.env.NODE_ENV === "production" ? "wss://wss.set-hub.pyszstudio.pl" : "ws://localhost:21822";
export const socket = io(hubUrl, { transports: ["websocket"] });

export type ConnectionState = "connected" | "connecting" | "disconnected" | "error";

type ConnectionStateHandler = (s: ConnectionState) => void;
const onStateChangedHandlers = [] as ConnectionStateHandler[];
export const onConnectionStateChanged = (handler: ConnectionStateHandler) => {
    onStateChangedHandlers.push(handler);
    return () => {
        onStateChangedHandlers.splice(onStateChangedHandlers.indexOf(handler), 1);
    };
}; //possible memory leaks

const runStateChangedHandlers = (s: ConnectionState) => onStateChangedHandlers.forEach(x => x(s));

socket.on("connect", () => {
    runStateChangedHandlers("connected");
});

socket.on("disconnect", () => {
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
    runStateChangedHandlers("connecting");
});

socket.io.on("reconnect_attempt", () => {
    runStateChangedHandlers("connecting");
});

socket.io.on("reconnect_failed", () => {
    runStateChangedHandlers("disconnected");
});
