import * as m from "@set/timer/model";
import cors from "cors";
import express from "express";
import { apply as applyHub } from "@set/hub";
import { apply as applyResults } from "@set/results";
import { ClockListPlayer, sort, UserCredentials } from "@set/shared/dist";
import { config } from "./config";
import { createServer } from "http";
import { fetchTimeGoNewResults, getTimeTrialResults } from "./results";
import { login } from "./auth";
import { parse } from "csv-parse";
import { PlayerResult } from "../shared/index";
import { promisify } from "util";
import { readFile, stat, writeFile } from "fs";
import { resolve } from "path";
import { Response } from "express";
import { stringify } from "csv-stringify";
import { ToStartPlayer, toStartPlayerToPlayer } from "./to-start";

const requireModule = (path: string) => resolve(__dirname + `/../node_modules/${path}`);

const isDevelopment = process.env.NODE_ENV === "development";

export interface TypedRequestBody<T> extends Express.Request {
    body: T;
}

const app = express();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
const server = createServer(app);

const minutesAgo = (minutes: number) => {
    const currentTime = new Date(Date.now());
    currentTime.setMilliseconds(0);
    currentTime.setSeconds(0);

    const currentTimeMinutesAgo = new Date(currentTime.getTime() - minutes * 60_000);
    return currentTimeMinutesAgo.getTime();
};

const readFileAsync = promisify(readFile);
const parseAsync = (data: Buffer, options: any) =>
    new Promise<any>((res, rej) =>
        parse(data, options, (err, results) => {
            res(results);
        })
    );
const stringifyAsync = (data: any) =>
    new Promise<string>((res, rej) => {
        stringify(data, { header: true }, (err, str) => {
            res(str);
        });
    });

const writeJson = <T>(content: T, path: string) => {
    writeFile(resolve(path), JSON.stringify(content), err => {
        if (err) {
            console.log(err);
        } else {
        }
    });
};

const readCsv = async <T>(path: string) => {
    const data = await readFileAsync(resolve(path));
    return (await parseAsync(data, { columns: true })) as T;
};

const loadRaceResults = () => {
    const fetches = [
        fetchTimeGoNewResults("http://timegonew.pl/?page=result&action=live&cid=8&did=3"),
        fetchTimeGoNewResults("http://timegonew.pl/?page=result&action=live&cid=8&did=1"),
        fetchTimeGoNewResults("http://timegonew.pl/?page=result&action=live&cid=8&did=4"),
        fetchTimeGoNewResults("http://timegonew.pl/?page=result&action=live&cid=8&did=2")
    ];

    Promise.all(fetches)
        .then(arr => arr.reduce((acc, arr) => [...acc, ...arr], []))
        .then(results => {
            writeJson(
                sort(results, r => r.number),
                "../timegonewresults.json"
            );
            // console.log(`race.results.fetch.success [${new Date().toLocaleString()}]`);
        })
        .catch(() => console.log(`race.results.fetch.fail [${new Date().toLocaleString()}]`));
};

const loadTimeTrialResults = () => {
    getTimeTrialResults()
        .then(results => {
            writeJson(results, "../timetrialresults.json");
            // console.log(`timetrial.results.fetch.success [${new Date().toLocaleString()}]`);
        })
        .catch(() => console.log(`timetrial.results.fetch.fail [${new Date().toLocaleString()}]`));
};

const run = async () => {
    app.use("/timer", express.static(requireModule("@set/mobile/build")));
    app.get("/timer/*", (_, res) => res.sendFile(requireModule("@set/mobile/build/index.html")));
    app.get("/state", (_, res) => {
        readFile(resolve("../state.json"), (err, data) => {
            if (err) throw err;
            res.json(JSON.parse(data as any));
        });
    });

    app.get("/race-results", (_, res) => {
        readFile(resolve("../timegonewresults.json"), (err, text: any) => {
            const playersResults: PlayerResult[] = err ? [] : JSON.parse(text);

            res.json(playersResults);
        });
    });

    app.get("/timetrial-results", (_, res) => {
        readFile(resolve("../timetrialresults.json"), (err, text: any) => {
            const playersResults: PlayerResult[] = err ? [] : JSON.parse(text);

            res.json(playersResults);
        });
    });

    app.get("/office-players", async (_, res) => {
        const funplayers = await readCsv<ToStartPlayer[]>("../ls-fun-2022.csv");
        const proplayers = await readCsv<ToStartPlayer[]>("../ls-pro-2022.csv");
        const ttplayers = await readCsv<ToStartPlayer[]>("../ls-tt-2022.csv");

        const allPlayers = [...funplayers, ...proplayers, ...ttplayers];

        const playersNumbers = new Set<string>(allPlayers.map(x => x["Nr zawodnika"]!));

        const officePlayers = [...playersNumbers.values()].map(n => {
            const races = allPlayers.filter(p => p["Nr zawodnika"] === n);
            const [playerData] = races;

            const officePlayer = {
                ["Nr zawodnika"]: playerData["Nr zawodnika"],
                ["Imię"]: playerData.Imię,
                ["Nazwisko"]: playerData.Nazwisko,
                ["Race"]: races.find(r => r.Klasyfikacja === "RnK PRO" || r.Klasyfikacja === "RnK FUN")?.Klasyfikacja,
                ["Time Trial"]: races.find(r => r.Klasyfikacja === "RnK TT")?.Klasyfikacja
            };

            return officePlayer;
        });

        const playersCsv = await stringifyAsync(sort(officePlayers, o => Number(o["Nr zawodnika"])));

        res.header("Content-Type", "text/csv");
        res.attachment("office-players.csv");
        return res.send(playersCsv);
    });

    app.get("/fun-players", async (_, res) => {
        const players: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-fun-2022.csv");

        const result = players.map(toStartPlayerToPlayer);

        res.json(result);
    });

    app.get("/pro-players", async (_, res) => {
        const players: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-pro-2022.csv");
        const result = players.map(toStartPlayerToPlayer);

        res.json(result);
    });

    app.get("/timetrial-players", async (_, res) => {
        const players: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-tt-2022.csv");
        const result = players.map(toStartPlayerToPlayer);

        res.json(result);
    });

    app.get("/players", (_, res) => {
        readFile(resolve("../players.json"), (err, data) => {
            const players: m.Player[] = err ? [] : JSON.parse(data as any);
            res.json(players);
        });
    });

    app.get("/players-date", (_, res) => {
        stat(resolve("../players.json"), (err, stats) => {
            res.json(err ? 0 : stats.mtimeMs);
        });
    });

    app.get("/timesync", (_, res) => {
        res.json(Date.now());
    });

    app.get("/clock-players", (_, res) => {
        readFile(resolve("../players.json"), (err, text: any) => {
            const players: m.Player[] = err ? [] : JSON.parse(text);
            const firstPlayerStart = minutesAgo(15);
            const startTimeFromNumber = (number: number) => firstPlayerStart + 8_000 * number;

            const clockPlayers: ClockListPlayer[] = sort(players, p => p.number).map((p, i) => ({
                number: p.number,
                name: p.name,
                lastName: p.lastName,
                startTime: startTimeFromNumber(i)
            }));

            res.json(clockPlayers);
        });
    });

    app.post("/log-in", async (req: TypedRequestBody<UserCredentials>, res: Response) => {
        try {
            const tokens = await login(req.body);
            const result = {
                authToken: tokens.encodedToken,
                issuedAt: tokens.iat,
                expireDate: tokens.exp
            };
            res.cookie(config.auth.cookieName, result.authToken, {
                httpOnly: true,
                maxAge: config.auth.maxAge * 1000
            });
            res.json(result);
            return;
        } catch (err) {
            console.log(err);
        }

        res.sendStatus(401);
    });

    await applyHub(server);

    if (!isDevelopment) await applyResults(app);

    server.listen(21822, "localhost", () => {
        console.log("SERVER_STARTED_LISTENING");
    });

    setInterval(loadRaceResults, 5000);
    setInterval(loadTimeTrialResults, 10000);
};

run();
