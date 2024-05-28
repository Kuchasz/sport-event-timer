import { createLogPrinter } from "@set/utils/dist/logger";
import { mdiFlagCheckered, mdiRayStartArrow, mdiRayVertex } from "@mdi/js";
import { formatNumber } from "@set/utils/dist/datetime";
import { env } from "./env";
import type { Route } from "next";

const secondMillis = 1_000;
const minuteMillis = secondMillis * 60;
const hourMillis = minuteMillis * 60;

const minuteSeconds = 60;
const hourSeconds = minuteSeconds * 60;
const daySeconds = hourSeconds * 24;

type ParseResult<T> =
    | {
          status: "Success";
          value: T;
      }
    | { status: "Error"; error: string };

export const timeStringToMiliseconds = (timeString: string): ParseResult<number> => {
    if (!/\d\d:\d\d/gm.test(timeString)) {
        return { status: "Error", error: "Passed value does not match pattern HH:MM" };
    }

    const [hour, minutes] = timeString.split(":");
    const timeResult = minuteMillis * Number(minutes) + hourMillis * Number(hour);

    return { status: "Success", value: timeResult };
};

export const fullTimeStringToEpochMiliseconds = (timeString: string, date: number): ParseResult<number> => {
    if (!/\d{2}:\d{2}:\d{2}\.\d{3}/gm.test(timeString)) {
        return { status: "Error", error: "Passed value does not match pattern HH:MM:SS.Ms" };
    }

    const [hour, minutes, sec_ms] = timeString.split(":");
    const [seconds, miliseconds] = sec_ms.split(".");

    const msResult =
        date +
        Number(miliseconds.padEnd(3, "0")) +
        secondMillis * Number(seconds) +
        minuteMillis * Number(minutes) +
        hourMillis * Number(hour);

    return { status: "Success", value: msResult };
};

export const formatSecondsToTimeSpan = (seconds: number) => {
    const day = Math.floor(seconds / daySeconds);
    const hour = Math.floor((seconds - day * daySeconds) / hourSeconds);
    const minute = Math.floor((seconds - day * daySeconds - hour * hourSeconds) / minuteSeconds);
    const second = seconds - day * daySeconds - hour * hourSeconds - minute * minuteSeconds;

    return day
        ? `${formatNumber(day)}d ${formatNumber(hour)}:${formatNumber(minute)}:${formatNumber(second)}`
        : hour
        ? `${formatNumber(hour)}:${formatNumber(minute)}:${formatNumber(second)}`
        : minute
        ? `${formatNumber(minute)}:${formatNumber(second)}`
        : second;
};

export const readLocalStorage = (key: string) => (typeof window !== "undefined" ? window.localStorage.getItem(key) : "");
export const parseJSON = (jsonString: string) =>
    typeof window !== "undefined" ? (JSON.parse(jsonString || "{}") as unknown) : ({} as unknown);
export const logger = createLogPrinter("@set");

export const getTimingPointIcon = (isFirst: boolean, isLast: boolean) => {
    return isFirst ? mdiRayStartArrow : isLast ? mdiFlagCheckered : mdiRayVertex;
};

export const buildApplicationPath = (
    path: string,
    protocol = env.NEXT_PUBLIC_NODE_ENV === "development" ? "http" : "https",
    appUrl = env.NEXT_PUBLIC_APP_URL,
) => `${protocol}://${appUrl}${path}` as Route;
