import { arrayRange, uuidv4 } from "@set/shared";
import { assignNumbersToPlayers } from "@set/timer/dist/list";
import { createStore } from "@set/timer/dist/store";
import {
    emptyToStartPlayer,
    ToStartPlayer,
    toStartPlayerToPlayer,
    toStartPlayerTransform
    } from "@set/timer/to-start";
import { parse } from "csv-parse/sync";
import { Player } from "@set/timer/dist/model";
import { readFile, writeFile } from "fs";
import { resolve } from "path";
import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { sort } from "@set/shared/dist";
import { staticTimeKeppers } from "@set/timer/dist/slices/time-keepers";
import { stringify } from "csv-stringify/sync";
import { transform } from "../timer/list";
import { upload } from "@set/timer/dist/slices/players";

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

    // readFile(resolve("../state.json"), { encoding: "utf8", flag: "r" }, (err, res) => {
    //     let state;

    //     if (err) {
    //         state = {
    //             players: [],
    //             timeKeepers: staticTimeKeppers,
    //             timeStamps: [],
    //             raceCategories: []
    //         };
    //     } else {
    //         state = JSON.parse(res.toString());
    //     }

    //     store.dispatch({
    //         type: "REPLACE_STATE",
    //         state
    //     });

    //     writeJson(state, "../state.json");
    // });

    // const clients: Socket[] = [];

    // io.on("connection", (socket: Socket) => {
    //     clients.push(socket);

    //     socket.on("post-action", action => {
    //         store.dispatch(action);
    //         socket.broadcast.emit("receive-action", action);

    //         const state = store.getState();
    //         writeJson(state, "../state.json");
    //     });

    // socket.on("upload-players", toStartPlayersCSV => {
    //     const parsedPlayers: ToStartPlayer[] = parse(toStartPlayersCSV, { columns: true });

    //     const uploadedPlayers = transform(parsedPlayers, toStartPlayerTransform);
    // const forbiddenNumbers = [179];

    // const paidPlayers = parsedPlayers
    //     .filter(p => p["Status opłaty"] === "Opłacony")
    //     .map(p => ({
    //         ...p,
    //         uid: uuidv4(),
    //         playerId: p["Adres email"] + p["Imię"] + p["Nazwisko"] + p["Data urodzenia"]
    //     }));

    // const playersNumbers = assignNumbersToPlayers(
    //     paidPlayers,
    //     forbiddenNumbers,
    //     [
    //         { name: "RnK PRO", excludes: ["GC", "RnK FUN"], range: { from: 101, to: 150 } },
    //         { name: "RnK FUN", excludes: ["GC", "RnK PRO"], range: { from: 151, to: 200 } },
    //         { name: "RnK TT", excludes: ["GC"], range: { from: 201, to: 250 } },
    //         { name: "GC", excludes: ["RnK FUN", "RnK PRO", "RnK TT"], range: { from: 1, to: 100 } }
    //     ],
    //     c => c.playerId,
    //     c => c["Klasyfikacja"],
    //     true
    // );

    // if (playersNumbers.type === "Error") {
    //     return;
    // }

    // const playersNumbersMap = new Map<string, number>(playersNumbers.playersNumbers);

    // const paidPlayersWithNumbers = paidPlayers.map(p => ({
    //     ...p,
    //     ["Nr zawodnika"]: String(playersNumbersMap.get(p.playerId))
    // }));

    //create staring list should part of seperate process!

    // const racePlayers = {
    //     pro: paidPlayersWithNumbers.filter(p => p.Klasyfikacja === "GC" || p.Klasyfikacja === "RnK PRO"),
    //     fun: paidPlayersWithNumbers.filter(p => p.Klasyfikacja === "RnK FUN"),
    //     tt: paidPlayersWithNumbers.filter(p => p.Klasyfikacja === "GC" || p.Klasyfikacja === "RnK TT")
    // };

    // const minProRacePlayers = sort(
    //     racePlayers.pro.map(p => ({
    //         ...p,
    //         Klasyfikacja: "RnK PRO",
    //         Kategoria: getAgeCategory(p),
    //         ...emptyToStartPlayer
    //     })),
    //     p => Number(p["Nr zawodnika"]!)
    // );

    // const minFunRacePlayers = sort(
    //     racePlayers.fun.map(p => ({
    //         ...p,
    //         Klasyfikacja: "RnK FUN",
    //         Kategoria: getAgeCategory(p),
    //         ...emptyToStartPlayer
    //     })),
    //     p => Number(p["Nr zawodnika"]!)
    // );

    // const minTimetrialRacePlayers = sort(
    //     racePlayers.tt.map(p => ({
    //         ...p,
    //         Klasyfikacja: "RnK TT",
    //         Kategoria: getAgeCategory(p),
    //         ...emptyToStartPlayer
    //     })),
    //     p => Number(p["Nr zawodnika"]!)
    // );

    // writeCsv(minProRacePlayers, "../ls-min-pro-2022.csv");
    // writeCsv(minFunRacePlayers, "../ls-min-fun-2022.csv");
    // writeCsv(minTimetrialRacePlayers, "../ls-min-tt-2022.csv");

    // const proRacePlayers = sort(
    //     racePlayers.pro.map(({ uid, playerId, ...p }) => ({
    //         ...p,
    //         Klasyfikacja: "RnK PRO",
    //         Kategoria: getAgeCategory(p)
    //     })),
    //     p => Number(p["Nr zawodnika"]!)
    // );

    // const funRacePlayers = sort(
    //     racePlayers.fun.map(({ uid, playerId, ...p }) => ({
    //         ...p,
    //         Klasyfikacja: "RnK FUN",
    //         Kategoria: getAgeCategory(p)
    //     })),
    //     p => Number(p["Nr zawodnika"]!)
    // );

    // const ttRacePlayers = sort(
    //     racePlayers.tt.map(({ uid, playerId, ...p }) => ({
    //         ...p,
    //         Klasyfikacja: "RnK TT",
    //         Kategoria: getAgeCategory(p)
    //     })),
    //     p => Number(p["Nr zawodnika"]!)
    // );

    // writeCsv(proRacePlayers, "../ls-pro-2022.csv");
    // writeCsv(funRacePlayers, "../ls-fun-2022.csv");
    // writeCsv(ttRacePlayers, "../ls-tt-2022.csv");

    // store.dispatch(upload(players));
    // writeJson(players, "../players-2022.json");
    // const state = store.getState();
    // writeJson(state, "../state.json");

    // io.emit("receive-state", store.getState());
    // });

    //     socket.on("disconnect", () => {
    //         clients.splice(clients.indexOf(socket), 1);
    //     });

    //     socket.emit("receive-state", store.getState());

    //     socket.on("TQ", () => {
    //         socket.emit("TR", Date.now());
    //     });
    // });

    return Promise.resolve(store.dispatch);
};
