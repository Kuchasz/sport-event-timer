import { createStore } from "@set/timer/store";
import { fakePlayers } from "@set/timer/slices/fake-players";
import { fakeRaceCategories } from "@set/timer/slices/fake-race-categories";
import { fakeTimeKeepers } from "@set/timer/slices/fake-time-keepers";
import { fakeTimeStamps } from "@set/timer/slices/fake-stamps";
import { resolve } from "path";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { writeFile } from "fs";

export const apply = (server: HttpServer): Promise<void> => {
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

    store.dispatch({
        type: "REPLACE_STATE",
        state: {
            players: fakePlayers,
            timeKeepers: fakeTimeKeepers,
            timeStamps: fakeTimeStamps,
            raceCategories: fakeRaceCategories
        }
    });

    const clients: Socket[] = [];

    io.on("connection", (socket: Socket) => {
        console.log(`CLIENT_CONNECTED: ${socket.id}`);
        clients.push(socket);

        socket.on("post-action", (action) => {
            store.dispatch(action);
            socket.broadcast.emit("receive-action", action);

            const state = store.getState();
            writeFile(resolve("../state.json"), JSON.stringify(state), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("state written");
                }
            });
        });

        socket.on("disconnect", () => {
            console.log(`CLIENT_DISCONNECTED: ${socket.id} `);
            clients.splice(clients.indexOf(socket), 1);
        });

        socket.emit("receive-state", store.getState());
    });

    return Promise.resolve();
};
