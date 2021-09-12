import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    serveClient: false,
    pingTimeout: 2000,
    pingInterval: 5000,
    transports: ["websocket"],
    cors: {
        origin: "https://kuchasz.github.io/sport-event-timer",
        methods: ["GET", "POST"]
    }
});

const clients: Socket[] = [];

io.on("connection", (socket: Socket) => {
    console.log(`CLIENT_CONNECTED: ${socket.id}`);
    clients.push(socket);

    socket.on("post-action", (action) => {
        console.log(`ACTION: ${action.type}`);
        socket.broadcast.emit("receive-action", action);
    });

    socket.on("disconnect", () => {
        console.log(`CLIENT_DISCONNECTED: ${socket.id} `);
        clients.splice(clients.indexOf(socket), 1);
    });
});

httpServer.listen(21822, () => {
    console.log("SERVER_STARTED_LISTENING");
});
