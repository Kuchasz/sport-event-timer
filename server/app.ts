import * as m from "@set/timer/model";
import cors from "cors";
import express from "express";
import { apply as applyHub } from "@set/hub";
import { apply as applyResults } from "@set/results";
import {
    ClockListPlayer,
    formatTimeNoSec,
    sort,
    UserCredentials
    } from "@set/shared/dist";
import { config } from "./config";
import { createServer } from "http";
import { emptyToStartPlayer, ToStartPlayer, toStartPlayerToPlayer } from "./to-start";
import { fetchTimeGoNewResults, getTimeTrialResults } from "./results";
import { login } from "./auth";
import { parse } from "csv-parse";
import { PlayerResult } from "../shared/index";
import { promisify } from "util";
import { readFile, stat, writeFile } from "fs";
import { resolve } from "path";
import { Response } from "express";
import { sortDesc } from "@set/shared/dist";
import { stringify } from "csv-stringify";
import { TimerState } from "../timer/store";
import { upload } from "@set/timer/dist/slices/players";

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

type NumberStartTime = { number: number; startTime: number };
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

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

const writeCsvAsync = <T>(content: T, path: string) =>
    new Promise<void>(async (res, rej) => {
        const contentCsvString = await stringifyAsync(content);
        await writeFileAsync(path, contentCsvString);
        res();
    });

const writeJson = <T>(content: T, path: string) => {
    writeFile(resolve(path), JSON.stringify(content), err => {
        if (err) {
            console.log(err);
        } else {
        }
    });
};

const readJsonAsync = async <T>(path: string) => {
    const contents = await readFileAsync(resolve(path));
    return JSON.parse(contents.toString()) as T;
};

const readCsv = async <T>(path: string) => {
    const data = await readFileAsync(resolve(path));
    return (await parseAsync(data, { columns: true })) as T;
};

const loadRaceResults = async () => {
    const today = new Date();
    if (today.getMonth() !== 3 && today.getDate() !== 10) return;

    const funResults = await fetchTimeGoNewResults("http://timegonew.pl/?page=result&action=live&cid=19&did=2");
    const funResultsOverrides = await readJsonAsync<PlayerResult[]>("../results-fun-2022-overrides.json");

    const finalFunResults = funResults.map(r => ({ ...r, ...funResultsOverrides.find(o => r.number === o.number) }));

    writeJson(
        sort(finalFunResults, r => r.number),
        "../results-fun-2022.json"
    );

    const proResults = await fetchTimeGoNewResults("http://timegonew.pl/?page=result&action=live&cid=19&did=1");
    const proResultsOverrides = await readJsonAsync<PlayerResult[]>("../results-pro-2022-overrides.json");

    const finalProResults = proResults.map(r => ({ ...r, ...proResultsOverrides.find(o => r.number === o.number) }));

    writeJson(
        sort(finalProResults, r => r.number),
        "../results-pro-2022.json"
    );
};

const loadTimeTrialResults = async () => {
    const today = new Date();
    if (today.getMonth() !== 3 && today.getDate() !== 10) return;

    const timeTrialResults = await getTimeTrialResults();
    const timeTrialResultsOverrides = await readJsonAsync<PlayerResult[]>("../results-tt-2022-overrides.json");

    const finalTimeTrialResults = timeTrialResults.map(r => ({
        ...r,
        ...timeTrialResultsOverrides.find(o => r.number === o.number)
    }));

    writeJson(finalTimeTrialResults, "../results-tt-2022.json");
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

    app.get("/pro-results", async (_, res) => {
        const proResults = await readFileAsync("../results-pro-2022.json");
        res.header("Content-Type", "application/json");
        res.send(proResults);
    });

    app.get("/fun-results", async (_, res) => {
        const funResults = await readFileAsync("../results-fun-2022.json");
        res.header("Content-Type", "application/json");
        res.send(funResults);
    });

    app.get("/timetrial-results", async (_, res) => {
        const timeTrialResults = await readFileAsync("../results-tt-2022.json");
        res.header("Content-Type", "application/json");
        res.send(timeTrialResults);
    });

    app.get("/gc-results", async (_, res) => {
        const proResults = await readJsonAsync<PlayerResult[]>("../results-pro-2022.json");
        const timeTrialResults = await readJsonAsync<PlayerResult[]>("../results-tt-2022.json");

        const summaryResults = proResults
            .map(pro => ({ pro, timeTrial: timeTrialResults.find(tt => pro.number === tt.number) }))
            .filter(p => p.timeTrial !== undefined)
            .map(p => ({
                number: p.pro.number,
                status: [p.pro.status, p.timeTrial!.status].includes("DSQ")
                    ? "DSQ"
                    : [p.pro.status, p.timeTrial!.status].includes("DNS")
                    ? "DNS"
                    : [p.pro.status, p.timeTrial!.status].includes("DNF")
                    ? "DNF"
                    : p.pro.status === "OK" && p.timeTrial!.status === "OK"
                    ? "OK"
                    : [p.pro.status, p.timeTrial!.status].find(s => s !== "OK"),
                result:
                    p.pro.status === "OK" && p.timeTrial!.status === "OK"
                        ? p.pro.result! + p.timeTrial?.result!
                        : undefined
            }));

        res.json(summaryResults);
    });

    app.get("/office-players", async (_, res) => {
        const funplayers = await readCsv<ToStartPlayer[]>("../ls-fun-2022.csv");
        const proplayers = await readCsv<ToStartPlayer[]>("../ls-pro-2022.csv");
        const ttplayers = await readCsv<ToStartPlayer[]>("../ls-tt-2022.csv");

        const allPlayers = [...funplayers, ...proplayers, ...ttplayers];

        const playersNumbers = new Set<string>(allPlayers.map(x => x["Nr zawodnika"]!));

        const officePlayers = [...playersNumbers.values()].map(n => {
            const races = allPlayers.filter(p => p["Nr zawodnika"] === n);
            const playerClassifications = new Set(races.map(r => r.Klasyfikacja));

            if (playerClassifications.size !== races.length) throw new Error("Something wrong is with starting lists");

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
        const toStartPlayers: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-tt-2022.csv");
        const players = toStartPlayers.map(toStartPlayerToPlayer);

        const startTimes = await readJsonAsync<NumberStartTime[]>("../start-tt-2022.json");

        const result = players.map(p => ({ ...p, startTime: startTimes.find(s => s.number === p.number)?.startTime }));

        res.json(sort(result, p => p.startTime || Number.MAX_VALUE));
    });

    app.get("/gc-players", async (_, res) => {
        const timeTrialPlayers: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-tt-2022.csv");
        const proPlayers: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-pro-2022.csv");

        const gcPlayers = proPlayers
            .map(pro => ({ pro, timeTrial: timeTrialPlayers.find(tt => pro["Nr zawodnika"] === tt["Nr zawodnika"]) }))
            .filter(p => p.timeTrial !== undefined)
            .map(p => ({ ...p.pro, Kategoria: p.pro.Płeć === "M" ? "M18-99" : "K18-99" }))
            .map(toStartPlayerToPlayer);

        res.json(gcPlayers);
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

    app.post("/calculate-nongc-start-times", async (req, res) => {
        const timeTrialPlayers: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-tt-2022.csv");
        const proPlayers: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-pro-2022.csv");

        const gcPlayers = timeTrialPlayers.filter(p => proPlayers.find(pp => p["Nr zawodnika"] === pp["Nr zawodnika"]));
        const nonGCPlayers = timeTrialPlayers.filter(
            p => !gcPlayers.find(gp => p["Nr zawodnika"] === gp["Nr zawodnika"])
        );

        const sexToNumber = (sex: string) => (sex === "M" ? 1 : 0);

        const nonGCWomanFirst = [...nonGCPlayers].sort((p1, p2) => sexToNumber(p1.Płeć) - sexToNumber(p2.Płeć));

        const raceStartTime = 1649581200000;
        const minute = 60_000;

        const nonGCNumbersWithTimes = nonGCWomanFirst.map((p, i) => ({
            number: Number(p["Nr zawodnika"]),
            startTime: raceStartTime + i * minute + Math.floor(i / 10) * minute
        }));

        writeJson(nonGCNumbersWithTimes, "../start-tt-2022.json");
        res.json("ok");
    });

    app.post("/calculate-gc-start-times", async (_, res) => {
        const startTimes = await readJsonAsync<{ number: number; startTime: number }[]>("../start-tt-2022.json");
        const timeTrialPlayers: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-tt-2022.csv");
        const proPlayers: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-pro-2022.csv");

        const gcPlayers = timeTrialPlayers.filter(p => proPlayers.find(pp => p["Nr zawodnika"] === pp["Nr zawodnika"]));
        const nonGCPlayers = timeTrialPlayers.filter(
            p => !gcPlayers.find(gp => p["Nr zawodnika"] === gp["Nr zawodnika"])
        );

        const nonGCNumbersWithTimes = nonGCPlayers.map(p => ({
            number: Number(p["Nr zawodnika"]),
            startTime: startTimes.find(s => Number(p["Nr zawodnika"]) === s.number)?.startTime
        }));

        const proResults = await readJsonAsync<PlayerResult[]>("../results-pro-2022.json");

        const sorted = sort(nonGCNumbersWithTimes, t => t.startTime!);
        const lastNonGCStartTime = sorted[sorted.length - 1].startTime!;

        const gcPlayersProResults = proResults.filter(p =>
            gcPlayers.find(gp => p.number === Number(gp["Nr zawodnika"]))
        );

        const GCSlowestFirst = sortDesc(gcPlayersProResults, r => r.result || Number.MAX_VALUE);

        const minute = 60_000;

        const GCNumbersWithTimes = GCSlowestFirst.map((p, i) => ({
            number: Number(p.number),
            startTime: lastNonGCStartTime + i * minute + 5 * minute
        }));

        const allTTStaringList = [...nonGCNumbersWithTimes, ...GCNumbersWithTimes];
        writeJson(allTTStaringList, "../start-tt-2022.json");

        res.json("ok");
    });

    app.post("/strip-lists", async () => {
        const timeTrialPlayers: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-tt-2022.csv");
        const proPlayers: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-pro-2022.csv");
        const funPlayers: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-fun-2022.csv");

        const minProRacePlayers = proPlayers.map(p => ({ ...p, ...emptyToStartPlayer }));
        const minFunRacePlayers = funPlayers.map(p => ({ ...p, ...emptyToStartPlayer }));
        const minTimetrialRacePlayers = timeTrialPlayers.map(p => ({ ...p, ...emptyToStartPlayer }));

        await writeCsvAsync(minProRacePlayers, "../ls-min-pro-2022.csv");
        await writeCsvAsync(minFunRacePlayers, "../ls-min-fun-2022.csv");
        await writeCsvAsync(minTimetrialRacePlayers, "../ls-min-tt-2022.csv");
    });

    app.post("/read-start-times", async (_, res) => {
        const toStartPlayers: ToStartPlayer[] = await readCsv<ToStartPlayer[]>("../ls-tt-2022.csv");
        const startTimes = await readJsonAsync<NumberStartTime[]>("../start-tt-2022.json");
        const players = toStartPlayers
            .map(toStartPlayerToPlayer)
            .map(p => ({ ...p, startTime: startTimes.find(s => p.number === s.number)?.startTime }));
        const state = await readJsonAsync<TimerState>("../state.json");

        state.players = players;
        state.timeStamps = [];
        state.actionsHistory = [];

        writeJson(players, "../players.json");
        writeJson(state, "../state.json");

        dispatch(upload(players));
        res.send("OK");
    });

    app.get("/clock-players", async (_, res) => {
        const players = await readJsonAsync<m.Player[]>("../players.json");
        const startTimes = await readJsonAsync<NumberStartTime[]>("../start-tt-2022.json");

        const clockPlayers: ClockListPlayer[] = sort(startTimes, p => p.number).map(t => ({
            number: t.number,
            name: players.find(p => t.number === p.number)?.name!,
            lastName: players.find(p => t.number === p.number)?.lastName!,
            startTime: t.startTime
        }));

        res.json(sort(clockPlayers, p => p.startTime));
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

    const dispatch = await applyHub(server);

    if (!isDevelopment) await applyResults(app);

    server.listen(21822, "localhost", () => {
        console.log("SERVER_STARTED_LISTENING");
    });

    setInterval(loadRaceResults, 10000);
    setInterval(loadTimeTrialResults, 10000);
};

run();
