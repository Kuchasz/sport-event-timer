import { parse } from "node-html-parser";
import { PlayerResult } from "@set/utils/dist";

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
    return fetch(resultsUrl)
        .then(r => r.text())
        .then(contents => {
            const colTypes = {
                name: "col-name",
                time: "col-time"
            };

            const tableDom = parse(contents).querySelector("table")!;

            const headerCells = tableDom.querySelectorAll("thead tr th");
            const timeCallIndex = headerCells.findIndex(c => c.classList.contains(colTypes.time));
            const nameCallIndex = headerCells.findIndex(c => c.classList.contains(colTypes.name));

            return tableDom
                .querySelectorAll("tbody tr")
                .map(tr => tr.querySelectorAll("td"))
                .map(tds => {
                    const [numberString] = tds[nameCallIndex].innerText.trim().split("]");
                    const number = Number(numberString.slice(1));

                    const res = timeStringToMiliseconds(tds[timeCallIndex].innerText);

                    return { number, result: res.time, status: res.status };
                });
        });
};