"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = void 0;
const store_1 = require("@set/timer/dist/store");
const to_start_1 = require("./to-start");
const players_1 = require("./players");
const sync_1 = require("csv-parse/sync");
const fs_1 = require("fs");
const path_1 = require("path");
const socket_io_1 = require("socket.io");
const dist_1 = require("@set/shared/dist");
const time_keepers_1 = require("@set/timer/dist/slices/time-keepers");
const sync_2 = require("csv-stringify/sync");
const writeJson = (content, path) => {
    (0, fs_1.writeFile)((0, path_1.resolve)(path), JSON.stringify(content), err => {
        if (err) {
            console.log(err);
        }
        else {
        }
    });
};
const writeCsv = (content, path) => {
    (0, fs_1.writeFile)((0, path_1.resolve)(path), (0, sync_2.stringify)(content, { header: true }), err => {
        if (err) {
            console.log(err);
        }
        else {
        }
    });
};
const readCsv = (path) => {
    (0, fs_1.readFile)((0, path_1.resolve)(path), (err, res) => {
        if (err) {
            console.log(err);
        }
        else {
            return (0, sync_1.parse)(res.toString());
        }
    });
};
const apply = (server) => {
    const io = new socket_io_1.Server(server, {
        serveClient: false,
        pingTimeout: 2000,
        pingInterval: 5000,
        transports: ["websocket"],
        cors: {
            origin: "https://wss.set-hub.pyszstudio.pl/timer",
            methods: ["GET", "POST"]
        }
    });
    const store = (0, store_1.createStore)([]);
    (0, fs_1.readFile)((0, path_1.resolve)("../state.json"), { encoding: "utf8", flag: "r" }, (err, res) => {
        let state;
        if (err) {
            state = {
                players: [],
                timeKeepers: time_keepers_1.staticTimeKeppers,
                timeStamps: [],
                raceCategories: []
            };
        }
        else {
            state = JSON.parse(res.toString());
        }
        store.dispatch({
            type: "REPLACE_STATE",
            state
        });
        writeJson(state, "../state.json");
    });
    const clients = [];
    io.on("connection", (socket) => {
        clients.push(socket);
        socket.on("post-action", action => {
            store.dispatch(action);
            socket.broadcast.emit("receive-action", action);
            const state = store.getState();
            writeJson(state, "../state.json");
        });
        socket.on("upload-players", playersCSV => {
            console.log("upload-players");
            const parsedPlayers = (0, sync_1.parse)(playersCSV, { columns: true });
            const getNumber = (potentialNumber) => String(potentialNumber < 179 ? potentialNumber : potentialNumber + 1);
            const getGender = (genderText) => (genderText === "M" ? "male" : "female");
            const paidPlayers = parsedPlayers.filter(p => p["Status opłaty"] === "Opłacony");
            const gcPlayers = paidPlayers.filter(p => p.Klasyfikacja === "GC");
            const nonGcPlayers = paidPlayers.filter(p => p.Klasyfikacja !== "GC");
            const proPlayers = paidPlayers.filter(p => p.Klasyfikacja === "RnK PRO");
            const funPlayers = paidPlayers.filter(p => p.Klasyfikacja === "RnK FUN");
            const ttPlayers = paidPlayers.filter(p => p.Klasyfikacja === "RnK TT");
            if (paidPlayers.filter(pp => pp["Adres email"] === undefined).length)
                throw new Error("Any player does not have email");
            if (gcPlayers.filter(gp => nonGcPlayers.find(ngc => gp["Adres email"] === ngc["Adres email"])).length)
                throw new Error("The same player paid in GC and any other classification");
            if (proPlayers.filter(pp => funPlayers.find(fp => pp["Adres email"] === fp["Adres email"])).length)
                throw new Error("The same player paid in PRO and FUN classification");
            if (proPlayers.filter(pp => ttPlayers.find(tp => pp["Adres email"] === tp["Adres email"])).length)
                throw new Error("The same player paid in PRO and TT classification");
            const uniqueEmails = new Set(paidPlayers.map(p => p["Adres email"]));
            const emailsNumers = new Map();
            let lastIndex = 1;
            gcPlayers.forEach((p, i) => {
                emailsNumers.set(p["Adres email"], getNumber(lastIndex + i));
            });
            lastIndex += gcPlayers.length + 10;
            proPlayers.forEach((p, i) => {
                emailsNumers.set(p["Adres email"], getNumber(lastIndex + i));
            });
            lastIndex += proPlayers.length + 10;
            funPlayers.forEach((p, i) => {
                emailsNumers.set(p["Adres email"], getNumber(lastIndex + i));
            });
            lastIndex += funPlayers.length + 10;
            ttPlayers
                .filter(tp => emailsNumers.has(tp["Adres email"]) === false)
                .forEach((p, i) => {
                emailsNumers.set(p["Adres email"], getNumber(lastIndex + i));
            });
            if (uniqueEmails.size !== emailsNumers.size)
                throw new Error("Emails may not be used as ids, emails are not unique");
            const paidPlayersWithNumbers = paidPlayers.map(p => (Object.assign(Object.assign({}, p), { ["Nr zawodnika"]: emailsNumers.get(p["Adres email"]) })));
            //create staring list
            const minProRacePlayers = paidPlayersWithNumbers
                .filter(p => p.Klasyfikacja === "GC" || p.Klasyfikacja === "RnK PRO")
                .map(p => (Object.assign(Object.assign(Object.assign({}, p), { Klasyfikacja: "RnK PRO", Kategoria: (0, players_1.getAgeCategory)(p) }), to_start_1.emptyToStartPlayer)));
            const minFunRacePlayers = paidPlayersWithNumbers
                .filter(p => p.Klasyfikacja === "RnK FUN")
                .map(p => (Object.assign(Object.assign(Object.assign({}, p), { Klasyfikacja: "RnK FUN", Kategoria: (0, players_1.getAgeCategory)(p) }), to_start_1.emptyToStartPlayer)));
            const minTimetrialRacePlayers = paidPlayersWithNumbers
                .filter(p => p.Klasyfikacja === "GC" || p.Klasyfikacja === "RnK TT")
                .map(p => (Object.assign(Object.assign(Object.assign({}, p), { Klasyfikacja: "RnK TT", Kategoria: (0, players_1.getAgeCategory)(p) }), to_start_1.emptyToStartPlayer)));
            writeCsv((0, dist_1.sort)(minProRacePlayers, p => Number(p["Nr zawodnika"])), "../ls-min-pro-2022.csv");
            writeCsv((0, dist_1.sort)(minFunRacePlayers, p => Number(p["Nr zawodnika"])), "../ls-min-fun-2022.csv");
            writeCsv((0, dist_1.sort)(minTimetrialRacePlayers, p => Number(p["Nr zawodnika"])), "../ls-min-tt-2022.csv");
            const proRacePlayers = paidPlayersWithNumbers
                .filter(p => p.Klasyfikacja === "GC" || p.Klasyfikacja === "RnK PRO")
                .map(p => (Object.assign(Object.assign({}, p), { Klasyfikacja: "RnK PRO", Kategoria: (0, players_1.getAgeCategory)(p) })));
            const funRacePlayers = paidPlayersWithNumbers
                .filter(p => p.Klasyfikacja === "RnK FUN")
                .map(p => (Object.assign(Object.assign({}, p), { Klasyfikacja: "RnK FUN", Kategoria: (0, players_1.getAgeCategory)(p) })));
            const ttRacePlayers = paidPlayersWithNumbers
                .filter(p => p.Klasyfikacja === "GC" || p.Klasyfikacja === "RnK TT")
                .map(p => (Object.assign(Object.assign({}, p), { Klasyfikacja: "RnK TT", Kategoria: (0, players_1.getAgeCategory)(p) })));
            writeCsv((0, dist_1.sort)(proRacePlayers, p => Number(p["Nr zawodnika"])), "../ls-pro-2022.csv");
            writeCsv((0, dist_1.sort)(funRacePlayers, p => Number(p["Nr zawodnika"])), "../ls-fun-2022.csv");
            writeCsv((0, dist_1.sort)(ttRacePlayers, p => Number(p["Nr zawodnika"])), "../ls-tt-2022.csv");
            // const csvPaidPlayers = stringify(
            //     sort(paidPlayersWithNumbers, p => p["Nr zawodnika"]!),
            //     {
            //         header: true
            //     }
            // );
            // writeFile(resolve("../lista-startowa-rura-2022.csv"), csvPaidPlayers, e => {
            //     if (e) console.log("An error occured while saving starting list");
            // });
            // .map((p, i) => ({
            //     id: i,
            //     name: p["Imię"],
            //     lastName: p["Nazwisko"],
            //     gender: getGender(p["Płeć"]),
            //     birthYear: Number(p["Data urodzenia"].split(".")[2]),
            //     number: Number(p["Nr zawodnika"]),
            //     raceCategory: p["Kategoria"],
            //     team: p["Nazwa klubu"],
            //     city: p["Miasto"],
            //     country: p["Państwo"]
            // }));
            // store.dispatch(upload(players));
            // writeJson(players, "../players-2022.json");
            // const state = store.getState();
            // writeJson(state, "../state.json");
            // io.emit("receive-state", store.getState());
            // console.log("upload-players");
            // const parsedPlayers = parse(playersCSV, { columns: true }) as any[];
            // const getGender = (genderText: "M" | "K") => (genderText === "M" ? "male" : "female");
            // const players: Player[] = parsedPlayers
            //     .filter((p) => p["Nr zawodnika"] !== "0")
            //     .map((p, i) => ({
            //         id: i,
            //         name: p["Imię"],
            //         lastName: p["Nazwisko"],
            //         gender: getGender(p["Płeć"]),
            //         birthYear: Number(p["Data urodzenia"].split(".")[2]),
            //         number: Number(p["Nr zawodnika"]),
            //         raceCategory: p["Kategoria"],
            //         team: p["Nazwa klubu"],
            //         city: p["Miasto"],
            //         country: p["Państwo"]
            //     }));
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
    return Promise.resolve();
};
exports.apply = apply;
