import { Player } from "@set/timer/model";
import { TimerState } from "@set/timer/dist/store";

const hubUrl = process.env.NODE_ENV === "production" ? "https://wss.set-hub.pyszstudio.pl" : "http://localhost:21822";
export const getState = (): Promise<TimerState> => fetch(`${hubUrl}/state`).then((x) => x.json());
export const getPlayers = (): Promise<Player[]> => fetch(`${hubUrl}/players`).then((x) => x.json());
export const getPlayersDate = (): Promise<number> => fetch(`${hubUrl}/players-date`).then((x) => x.json());
export const timeSyncUrl = `${hubUrl}/timesync`;
// export const getCurrentTimeOffset = (): Promise<number> => {
//     return new Promise<number>(async (res) => {
//         const clientTime = Date.now();
//         const { serverTime } = await fetch(`${hubUrl}/current-time`).then((x) => x.json());
//         var returned = Date.now();
//         var timestamp = [clientTime, serverTime;
//         var original = +timestamp[0];
//         var receive = +timestamp[1];
//         var transmit = +timestamp[2];
//         var sending = receive - original;
//         var receiving = returned - transmit;
//         var roundtrip = sending + receiving;
//         var oneway = roundtrip / 2;
//         var difference = sending - oneway;

//         return difference;
//         // const clientTime = Date.now();
//         // const reqSendTime = Date.now();
//         // const { serverTime } = await fetch(`${hubUrl}/current-time`).then((x) => x.json());
//         // const reqBackTime = Date.now();

//         // const delay = (reqBackTime - reqSendTime) / 2;

//         // console.log("delay: ", delay);

//         // res(clientTime - (serverTime + delay));
//     });
// };
