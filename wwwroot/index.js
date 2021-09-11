"use strict";
var _a;
exports.__esModule = true;
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var httpServer = (0, http_1.createServer)();
var io = new socket_io_1.Server(httpServer, {
    serveClient: false,
    pingTimeout: 2000,
    pingInterval: 5000,
    transports: ["websocket"],
    cors: {
        origin: "https://kuchasz.github.io/sport-event-timer",
        methods: ["GET", "POST"]
    }
});
var clients = [];
io.on("connection", function (socket) {
    console.log("CLIENT_CONNECTED: " + socket.id);
    clients.push(socket);
    socket.on("post-action", function (action) {
        console.log("ACTION: " + action.type);
        socket.broadcast.emit("receive-action", action);
    });
    socket.on("disconnect", function () {
        console.log("CLIENT_DISCONNECTED: " + socket.id);
        clients.splice(clients.indexOf(socket), 1);
    });
});
httpServer.listen((_a = process.env.PORT) !== null && _a !== void 0 ? _a : "3001");
