"use strict";
exports.__esModule = true;
var express_1 = require("express");
var http_1 = require("http");
var store_1 = require("@set/timer/store");
var fake_players_1 = require("@set/timer/slices/fake-players");
var fake_race_categories_1 = require("@set/timer/slices/fake-race-categories");
var fake_time_keepers_1 = require("@set/timer/slices/fake-time-keepers");
var fake_stamps_1 = require("@set/timer/slices/fake-stamps");
var socket_io_1 = require("socket.io");
var app = (0, express_1["default"])();
var server = (0, http_1.createServer)(app);
app.get("/", function (_, res) {
    res.send("<h1>Hello world</h1>");
});
var io = new socket_io_1.Server(server, {
    serveClient: false,
    pingTimeout: 2000,
    pingInterval: 5000,
    transports: ["websocket"],
    cors: {
        origin: "https://kuchasz.github.io/sport-event-timer",
        methods: ["GET", "POST"]
    }
});
var store = (0, store_1.createStore)([]);
store.dispatch({
    type: "REPLACE_STATE",
    state: {
        players: fake_players_1.fakePlayers,
        timeKeepers: fake_time_keepers_1.fakeTimeKeepers,
        timeStamps: fake_stamps_1.fakeTimeStamps,
        raceCategories: fake_race_categories_1.fakeRaceCategories
    }
});
var clients = [];
io.on("connection", function (socket) {
    console.log("CLIENT_CONNECTED: " + socket.id);
    clients.push(socket);
    socket.on("post-action", function (action) {
        store.dispatch(action);
        socket.broadcast.emit("receive-action", action);
    });
    socket.on("disconnect", function () {
        console.log("CLIENT_DISCONNECTED: " + socket.id + " ");
        clients.splice(clients.indexOf(socket), 1);
    });
    socket.emit("receive-state", store.getState());
});
server.listen(21822, "localhost", function () {
    console.log("SERVER_STARTED_LISTENING");
});
