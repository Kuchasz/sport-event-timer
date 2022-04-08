import { createStore } from "@set/timer/dist/store";
import { emptyToStartPlayer, ToStartPlayer, toStartPlayerToPlayer } from "./to-start";
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

        socket.on("post-action", action => {
            store.dispatch(action);
            socket.broadcast.emit("receive-action", action);

            const state = store.getState();
            writeJson(state, "../state.json");
        });

        socket.on("upload-players", playersCSV => {
            console.log("upload-players");
            const parsedPlayers: ToStartPlayer[] = parse(playersCSV, { columns: true });

            if (parsedPlayers.length < 10) return;

            const getNumber = (potentialNumber: number) =>
                String(potentialNumber < 179 ? potentialNumber : potentialNumber + 1);

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

            const uniqueEmails = new Set<string>(paidPlayers.map(p => p["Adres email"]));
            const emailsNumers = new Map<string, string>();

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

            const paidPlayersWithNumbers = paidPlayers.map(p => ({
                ...p,
                ["Nr zawodnika"]: emailsNumers.get(p["Adres email"])
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
                    .map(p => ({ ...p, Klasyfikacja: "RnK PRO", Kategoria: getAgeCategory(p) })),
                p => Number(p["Nr zawodnika"]!)
            );

            const funRacePlayers = sort(
                paidPlayersWithNumbers
                    .filter(p => p.Klasyfikacja === "RnK FUN")
                    .map(p => ({ ...p, Klasyfikacja: "RnK FUN", Kategoria: getAgeCategory(p) })),
                p => Number(p["Nr zawodnika"]!)
            );

            const ttRacePlayers = sort(
                paidPlayersWithNumbers
                    .filter(p => p.Klasyfikacja === "GC" || p.Klasyfikacja === "RnK TT")
                    .map(p => ({ ...p, Klasyfikacja: "RnK TT", Kategoria: getAgeCategory(p) })),
                p => Number(p["Nr zawodnika"]!)
            );

            writeCsv(proRacePlayers, "../ls-pro-2022.csv");
            writeCsv(funRacePlayers, "../ls-fun-2022.csv");
            writeCsv(ttRacePlayers, "../ls-tt-2022.csv");

            // const csvPaidPlayers = stringify(
            //     sort(paidPlayersWithNumbers, p => p["Nr zawodnika"]!),
            //     {
            //         header: true
            //     }
            // );

            // writeFile(resolve("../lista-startowa-rura-2022.csv"), csvPaidPlayers, e => {
            //     if (e) console.log("An error occured while saving starting list");
            // });

            // const players = ttRacePlayers.map(toStartPlayerToPlayer);

            // store.dispatch(upload(players));
            // writeJson(players, "../players.json");
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
