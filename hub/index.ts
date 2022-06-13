import { arrayRange, uuidv4 } from "@set/shared";
import { createStore } from "@set/timer/dist/store";
import { emptyToStartPlayer, ToStartPlayer, toStartPlayerToPlayer } from "@set/timer/to-start";
import { getAgeCategory } from "./players";
import { parse } from "csv-parse/sync";
import { Player } from "@set/timer/dist/model";
import { readFile, writeFile } from "fs";
import { resolve } from "path";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { sort } from "@set/shared/dist";
import { staticTimeKeppers } from "@set/timer/dist/slices/time-keepers";
import { stringify } from "csv-stringify/sync";
import { upload } from "@set/timer/dist/slices/players";

const writeJson = <T>(content: T, path: string) => {
    writeFile(resolve(path), JSON.stringify(content), err => {
        if (err) {
            console.log(err);
        } else {
        }
    });
};

const writeCsv = <T>(content: T, path: string) => {
    writeFile(resolve(path), stringify(content as any, { header: true }), err => {
        if (err) {
            console.log(err);
        } else {
        }
    });
};

const readCsv = <T>(path: string) => {
    readFile(resolve(path), (err, res) => {
        if (err) {
            console.log(err);
        } else {
            return parse(res.toString());
        }
    });
};

export const apply = (server: HttpServer): Promise<any> => {
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

        socket.on("post-action", action => {
            store.dispatch(action);
            socket.broadcast.emit("receive-action", action);

            const state = store.getState();
            writeJson(state, "../state.json");
        });

        socket.on("upload-players", toStartPlayersCSV => {
            const parsedPlayers: ToStartPlayer[] = parse(toStartPlayersCSV, { columns: true });
            const forbiddenNumbers = [179];

            if (parsedPlayers.length < 10) return;

            const paidPlayers = parsedPlayers
                .filter(p => p["Status opłaty"] === "Opłacony")
                .map(p => ({
                    ...p,
                    uid: uuidv4(),
                    playerId: p["Adres email"] + p["Imię"] + p["Nazwisko"] + p["Data urodzenia"]
                }));

            let potentialNumbers = arrayRange(1, 1000)
                .filter(pn => forbiddenNumbers.includes(pn) === false)
                .reverse();

            const gcPlayers = paidPlayers.filter(p => p.Klasyfikacja === "GC");
            const nonGcPlayers = paidPlayers.filter(p => p.Klasyfikacja !== "GC");
            const proPlayers = paidPlayers.filter(p => p.Klasyfikacja === "RnK PRO");
            const funPlayers = paidPlayers.filter(p => p.Klasyfikacja === "RnK FUN");
            const ttPlayers = paidPlayers.filter(p => p.Klasyfikacja === "RnK TT");

            if (gcPlayers.filter(gp => nonGcPlayers.find(ngc => gp["playerId"] === ngc["playerId"])).length)
                throw new Error("The same player paid in GC and any other classification");

            if (proPlayers.filter(pp => funPlayers.find(fp => pp["playerId"] === fp["playerId"])).length)
                throw new Error("The same player paid in PRO and FUN classification");

            if (proPlayers.filter(pp => ttPlayers.find(tp => pp["playerId"] === tp["playerId"])).length)
                throw new Error("The same player paid in PRO and TT classification separately");

            const playerUids = new Set<string>(paidPlayers.map(p => p["uid"]));
            const uidsNumbers = new Map<string, string>();

            gcPlayers.forEach((p, i) => {
                uidsNumbers.set(p["uid"], String(potentialNumbers.pop()));
            });

            potentialNumbers = potentialNumbers.slice(10);

            proPlayers.forEach((p, i) => {
                uidsNumbers.set(p["uid"], String(potentialNumbers.pop()));
            });

            potentialNumbers = potentialNumbers.slice(10);

            funPlayers.forEach((p, i) => {
                uidsNumbers.set(p["uid"], String(potentialNumbers.pop()));
            });

            potentialNumbers = potentialNumbers.slice(10);

            ttPlayers.forEach((p, i) => {
                uidsNumbers.set(p["uid"], String(potentialNumbers.pop()));
            });

            if (playerUids.size !== uidsNumbers.size) throw new Error("Not all players got numbers");

            const paidPlayersWithNumbers = paidPlayers.map(p => ({
                ...p,
                ["Nr zawodnika"]: uidsNumbers.get(p["uid"])
            }));

            //create staring list

            const minProRacePlayers = sort(
                paidPlayersWithNumbers
                    .filter(p => p.Klasyfikacja === "GC" || p.Klasyfikacja === "RnK PRO")
                    .map(p => ({ ...p, Klasyfikacja: "RnK PRO", Kategoria: getAgeCategory(p), ...emptyToStartPlayer })),
                p => Number(p["Nr zawodnika"]!)
            );

            const minFunRacePlayers = sort(
                paidPlayersWithNumbers
                    .filter(p => p.Klasyfikacja === "RnK FUN")
                    .map(p => ({ ...p, Klasyfikacja: "RnK FUN", Kategoria: getAgeCategory(p), ...emptyToStartPlayer })),
                p => Number(p["Nr zawodnika"]!)
            );

            const minTimetrialRacePlayers = sort(
                paidPlayersWithNumbers
                    .filter(p => p.Klasyfikacja === "GC" || p.Klasyfikacja === "RnK TT")
                    .map(p => ({ ...p, Klasyfikacja: "RnK TT", Kategoria: getAgeCategory(p), ...emptyToStartPlayer })),
                p => Number(p["Nr zawodnika"]!)
            );

            writeCsv(minProRacePlayers, "../ls-min-pro-2022.csv");
            writeCsv(minFunRacePlayers, "../ls-min-fun-2022.csv");
            writeCsv(minTimetrialRacePlayers, "../ls-min-tt-2022.csv");

            const proRacePlayers = sort(
                paidPlayersWithNumbers
                    .filter(p => p.Klasyfikacja === "GC" || p.Klasyfikacja === "RnK PRO")
                    .map(({ uid, playerId, ...p }) => ({
                        ...p,
                        Klasyfikacja: "RnK PRO",
                        Kategoria: getAgeCategory(p)
                    })),
                p => Number(p["Nr zawodnika"]!)
            );

            const funRacePlayers = sort(
                paidPlayersWithNumbers
                    .filter(p => p.Klasyfikacja === "RnK FUN")
                    .map(({ uid, playerId, ...p }) => ({
                        ...p,
                        Klasyfikacja: "RnK FUN",
                        Kategoria: getAgeCategory(p)
                    })),
                p => Number(p["Nr zawodnika"]!)
            );

            const ttRacePlayers = sort(
                paidPlayersWithNumbers
                    .filter(p => p.Klasyfikacja === "GC" || p.Klasyfikacja === "RnK TT")
                    .map(({ uid, playerId, ...p }) => ({ ...p, Klasyfikacja: "RnK TT", Kategoria: getAgeCategory(p) })),
                p => Number(p["Nr zawodnika"]!)
            );

            writeCsv(proRacePlayers, "../ls-pro-2022.csv");
            writeCsv(funRacePlayers, "../ls-fun-2022.csv");
            writeCsv(ttRacePlayers, "../ls-tt-2022.csv");

            // store.dispatch(upload(players));
            // writeJson(players, "../players-2022.json");
            // const state = store.getState();
            // writeJson(state, "../state.json");

            // io.emit("receive-state", store.getState());
        });

        socket.on("disconnect", () => {
            clients.splice(clients.indexOf(socket), 1);
        });

        socket.emit("receive-state", store.getState());

        socket.on("TQ", () => {
            socket.emit("TR", Date.now());
        });
    });

    return Promise.resolve(store.dispatch);
};
