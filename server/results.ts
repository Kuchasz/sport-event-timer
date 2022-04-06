import { parse } from "node-html-parser";
import { PlayerResult } from "@set/shared/dist";
import { promisify } from "util";
import { readFile } from "fs";
import { resolve } from "path";
import { TimerState } from "@set/timer/dist/store";

const readFileAsync = promisify(readFile);

const timeStringToMiliseconds = (timeString: string): { time?: number; status: string } => {
    if (!timeString.includes(".")) return { time: undefined, status: timeString };

    //HH:MM:SS.MM
    const [times, miliseconds] = timeString.split(".");
    const [seconds, minutes, hours] = times.split(":").reverse();

    let time = !isNaN(parseInt(miliseconds)) ? 10 * parseInt(miliseconds) : 0;
    time += !isNaN(parseInt(seconds)) ? 1_000 * parseInt(seconds) : 0;
    time += !isNaN(parseInt(minutes)) ? 60_000 * parseInt(minutes) : 0;
    time += !isNaN(parseInt(hours)) ? 3_600_000 * parseInt(hours) : 0;

    return { time, status: "OK" };
};

export const fetchTimeGoNewResults = (resultsUrl: string): Promise<PlayerResult[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    return fetch(resultsUrl, { signal: controller.signal })
        .then((r) => r.text())
        .then((contents) => {
            clearTimeout(timeoutId);

            const colTypes = {
                name: "col-name",
                time: "col-time"
            };

            const tableDom = parse(contents).querySelector("table")!;

            const headerCells = tableDom.querySelectorAll("thead tr th");
            const timeCallIndex = headerCells.findIndex((c) => c.classList.contains(colTypes.time));
            const nameCallIndex = headerCells.findIndex((c) => c.classList.contains(colTypes.name));

            return tableDom
                .querySelectorAll("tbody tr")
                .map((tr) => tr.querySelectorAll("td"))
                .map((tds) => {
                    const [numberString] = tds[nameCallIndex].innerText.trim().split("]");
                    const number = Number(numberString.slice(1));

                    const res = timeStringToMiliseconds(tds[timeCallIndex].innerText);

                    return { number, result: res.time, status: res.status };
                });
        });
};

const calculateFinalTime = (start: number, end: number) => {
    return new Date(end - start).getTime();
};

export const getTimeTrialResults = async () => {
    const stateJson = await readFileAsync(resolve("../state.json"));

    const state: TimerState = JSON.parse(stateJson.toString());

    const startTimeKeeper = state.timeKeepers.find((x) => x.type === "start");
    const stopTimeKeeper = state.timeKeepers.find((x) => x.type === "end");

    const playersWithTimes: PlayerResult[] = state.players
        .filter(
            (p) =>
                state.timeStamps.find((ts) => ts.playerId === p.id && ts.timeKeeperId === startTimeKeeper?.id)?.time &&
                state.timeStamps.find((ts) => ts.playerId === p.id && ts.timeKeeperId === stopTimeKeeper?.id)?.time
        )
        .map((p) => ({
            number: p.number,
            result: calculateFinalTime(
                state.timeStamps.find((ts) => ts.playerId === p.id && ts.timeKeeperId === startTimeKeeper?.id)!.time,
                state.timeStamps.find((ts) => ts.playerId === p.id && ts.timeKeeperId === stopTimeKeeper?.id)!.time
            ),
            status: "OK"
        }));

    return playersWithTimes;
    // ,
    //     resultStr: calculateFinalTimeStr(
    //         state.timeStamps.find((ts) => ts.playerId === p.id && ts.timeKeeperId === startTimeKeeper?.id)!.time,
    //         state.timeStamps.find((ts) => ts.playerId === p.id && ts.timeKeeperId === stopTimeKeeper?.id)!.time
    //     )
};
