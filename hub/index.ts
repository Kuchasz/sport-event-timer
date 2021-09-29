import parse from "csv-parse/lib/sync";
import { createStore } from "@set/timer/store";
import { fakePlayers } from "@set/timer/slices/fake-players";
import { fakeRaceCategories } from "@set/timer/slices/fake-race-categories";
import { fakeTimeKeepers } from "@set/timer/slices/fake-time-keepers";
import { fakeTimeStamps } from "@set/timer/slices/fake-stamps";
import { Player } from "@set/timer/model";
import { resolve } from "path";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { upload } from "@set/timer/slices/players";
import { writeFile } from "fs";

export const apply = (server: HttpServer): Promise<void> => {
    const io = new Server(server, {
        serveClient: false,
        pingTimeout: 2000,
        pingInterval: 5000,
        transports: ["websocket"],
        cors: {
            origin: "https://wss.set-hub.pyszstudio.pl/timer",
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
        clients.push(socket);

        socket.on("post-action", (action) => {
            store.dispatch(action);
            socket.broadcast.emit("receive-action", action);

            const state = store.getState();
            writeFile(resolve("../state.json"), JSON.stringify(state), (err) => {
                if (err) {
                    console.log(err);
                } else {
                }
            });
        });

        socket.on("upload-players", (playersCSV) => {
            const parsedPlayers = parse(playersCSV, { columns: true }) as any[];
            const getGender = (genderText: "M" | "K") => (genderText === "M" ? "male" : "female");

            const players: Player[] = parsedPlayers.map((p, i) => ({
                id: i,
                name: p["Imię"],
                lastName: p["Nazwisko"],
                gender: getGender(p["Płeć"]),
                birthYear: new Date(p["Data urodzenia"]).getFullYear(),
                number: i //p["Nr zawodnika"]!!!!!!!!!!!!!!!!!!!
            }));

            store.dispatch(upload(players));

            io.emit("receive-state", store.getState());
        });

        socket.on("disconnect", () => {
            clients.splice(clients.indexOf(socket), 1);
        });

        socket.emit("receive-state", store.getState());

        socket.emit("sync-time", Date.now());
    });

    return Promise.resolve();
};
