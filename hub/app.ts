import { createServer } from "http";
import { createStore } from "@set/timer/store";
import { Server, Socket } from "socket.io";

const server = createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("hello world!\n");
});

const io = new Server(server, {
    serveClient: false,
    pingTimeout: 2000,
    pingInterval: 5000,
    transports: ["websocket"],
    cors: {
        origin: "https://kuchasz.github.io/sport-event-timer",
        methods: ["GET", "POST"]
    }
});

const store = createStore([]);

const clients: Socket[] = [];

io.on("connection", (socket: Socket) => {
    console.log(`CLIENT_CONNECTED: ${socket.id}`);
    clients.push(socket);

    socket.on("post-action", (action) => {
        console.log(`ACTION: ${action.type}`);
        store.dispatch(action);
        socket.broadcast.emit("receive-action", action);
    });

    socket.on("disconnect", () => {
        console.log(`CLIENT_DISCONNECTED: ${socket.id} `);
        clients.splice(clients.indexOf(socket), 1);
    });

    socket.emit("receive-state", store.getState());
});

server.listen(21822, "localhost", () => {
    console.log("SERVER_STARTED_LISTENING");
});
