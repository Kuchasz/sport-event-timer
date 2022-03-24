import { createStore } from "@set/timer/dist/store";
import { parse } from "csv-parse/sync";
import { Player } from "@set/timer/model";
import { readFile, writeFile } from "fs";
import { resolve } from "path";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { staticTimeKeppers } from "@set/timer/slices/fake-time-keepers";
import { upload } from "@set/timer/slices/players";

const writeJson = <T>(content: T, path: string) => {
    writeFile(resolve(path), JSON.stringify(content), (err) => {
        if (err) {
            console.log(err);
        } else {
        }
    });
};

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

    readFile(resolve("../state.json"), { encoding: "utf8", flag: "r" }, (err, res) => {
        let state;

        if (err) {
            state = {
                players: [],
                timeKeepers: staticTimeKeppers,
                timeStamps: [],
                raceCategories: []
            };
        } else {
            state = JSON.parse(res.toString());
        }

        store.dispatch({
            type: "REPLACE_STATE",
            state
        });

        writeJson(state, "../state.json");
    });

    const clients: Socket[] = [];

    io.on("connection", (socket: Socket) => {
        clients.push(socket);

        socket.on("post-action", (action) => {
            store.dispatch(action);
            socket.broadcast.emit("receive-action", action);

            const state = store.getState();
            writeJson(state, "../state.json");
        });

        socket.on("upload-players", (playersCSV) => {
            console.log("upload-players");
            const parsedPlayers = parse(playersCSV, { columns: true }) as any[];
            const getGender = (genderText: "M" | "K") => (genderText === "M" ? "male" : "female");

            const players: Player[] = parsedPlayers
                .filter((p) => p["Nr zawodnika"] !== "0")
                .map((p, i) => ({
                    id: i,
                    name: p["Imię"],
                    lastName: p["Nazwisko"],
                    gender: getGender(p["Płeć"]),
                    birthYear: Number(p["Data urodzenia"].split(".")[2]),
                    number: Number(p["Nr zawodnika"]),
                    raceCategory: p["Kategoria"],
                    team: p["Nazwa klubu"],
                    city: p["Miasto"],
                    country: p["Państwo"]
                }));

            store.dispatch(upload(players));
            writeJson(players, "../players.json");
            const state = store.getState();
            writeJson(state, "../state.json");

            io.emit("receive-state", store.getState());
        });

        socket.on("disconnect", () => {
            clients.splice(clients.indexOf(socket), 1);
        });

        socket.emit("receive-state", store.getState());

        socket.on("TQ", () => {
            socket.emit("TR", Date.now());
        });
    });

    return Promise.resolve();
};
