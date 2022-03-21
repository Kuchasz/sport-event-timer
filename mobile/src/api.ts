import { hubUrl } from "./connection";

export const getCurrentTimeOffset = (): Promise<number> => {
    return new Promise<number>(async (res) => {
        const loadStartTime = Date.now();
        const serverTime = await fetch(`${hubUrl}/timesync`)
            .then((x) => x.json())
            .then(Number);
        const loadEndTime = Date.now();

        const latency = loadEndTime - loadStartTime;

        res(-(loadEndTime - (serverTime + latency / 2)));
    });
};
