import { LoginResult, UserCredentials } from "@set/shared/dist";
// import { Classification } from "@set/timer/model";
// import { hubUrl } from "./connection";

// export const getCurrentTimeOffset = (): Promise<number> => {
//     return new Promise<number>(async res => {
//         const loadStartTime = Date.now();
//         const serverTime = await fetch(`${hubUrl}/timesync`)
//             .then(x => x.json())
//             .then(Number);
//         const loadEndTime = Date.now();

//         const latency = loadEndTime - loadStartTime;

//         res(-(loadEndTime - (serverTime + latency / 2)));
//     });
// };

// export const readPlayersStartTimes = () => f.post("/read-start-times", {});
// export const calculateNonGCStartTimes = () => f.post(`/calculate-nongc-start-times`, {});
// export const calculateGCStartTimes = () => f.post(`/calculate-gc-start-times`, {});
// export const stripLists = () => f.post("/strip-lists", {});
// export const uploadPlayers = (playersCSV: string) => f.post("/upload-players", { playersCSV });
// export const assignPlayerNumbers = () => f.post("/assign-numbers", {});

// export const f = {
//     post: <T>(url: string, body: any) =>
//         fetch(hubUrl + url, {
//             method: "POST",
//             credentials: "include",
//             headers: {
//                 Accept: "application/json",
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(body)
//         }).then(result => result.json() as Promise<T>),
//     get: <T>(url: string) => fetch(hubUrl + url).then(resp => resp.json() as Promise<T>)
// };

export const logIn = (credentials: UserCredentials): Promise<LoginResult> =>
    Promise.resolve({ authToken: "awwdawd", expireDate: 999999999999999999999, issuedAt: 99999999999999999 });
// f.post<LoginResult>("/log-in", credentials);
