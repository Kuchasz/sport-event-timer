import { hubUrl } from "./connection";
import { LoginResult, UserCredentials } from "@set/shared/dist";

export const getCurrentTimeOffset = (): Promise<number> => {
    return new Promise<number>(async res => {
        const loadStartTime = Date.now();
        const serverTime = await fetch(`${hubUrl}/timesync`)
            .then(x => x.json())
            .then(Number);
        const loadEndTime = Date.now();

        const latency = loadEndTime - loadStartTime;

        res(-(loadEndTime - (serverTime + latency / 2)));
    });
};

export const readPlayersStartTimes = () => {
    fetch(`${hubUrl}/read-start-times`, { method: "POST" });
};

export const calculateStartTimes = () => {
    fetch(`${hubUrl}/calculate-start-times`, { method: "POST" });
};

export const f = {
    post: <T>(url: string, body: any) =>
        fetch(hubUrl + url, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(result => result.json() as Promise<T>),
    get: <T>(url: string) => fetch(hubUrl + url).then(resp => resp.json() as Promise<T>)
};

export const logIn = (credentials: UserCredentials) => f.post<LoginResult>("/log-in", credentials);
