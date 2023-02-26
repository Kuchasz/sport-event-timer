import { createLogPrinter } from "@set/utils/dist/logger";
import { mdiFlagCheckered, mdiRayStartArrow, mdiRayVertex } from "@mdi/js";
import { formatNumber } from "@set/utils/dist/datetime";

const secondMillis = 1_000;
const minuteMillis = secondMillis * 60;
const hourMillis = minuteMillis * 60;

const minuteSeconds = 60;
const hourSeconds = minuteSeconds * 60;
const daySeconds = hourSeconds * 24;


export const timeStringToMiliseconds = (timeString: string) => {
    if (!/\d\d:\d\d/gm.test(timeString)) {
        alert("Passed value does not match pattern HH:MM");
        return undefined;
    }

    const [hour, minutes] = timeString.split(":");
    return minuteMillis * Number(minutes) + hourMillis * Number(hour);
};

export const fullTimeStringToMiliseconds = (timeString: string) => {
    if (!/\d{1,2}:\d{1,2}:\d{1,2}\.\d{1,3}/gm.test(timeString)) {
        alert("Passed value does not match pattern HH:MM:SS.Ms");
        return undefined;
    }

    const [hour, minutes, sec_ms] = timeString.split(":");
    const [seconds, miliseconds] = sec_ms.split(".");

    return (
        Number(miliseconds.padEnd(3, "0")) +
        secondMillis * Number(seconds) +
        minuteMillis * Number(minutes) +
        hourMillis * Number(hour)
    );
};

export const formatSecondsToTimeSpan = (seconds: number) => {

    const day = Math.floor(seconds / daySeconds);
    const hour = Math.floor((seconds - (day * daySeconds)) / hourSeconds);
    const minute = Math.floor((seconds - (day * daySeconds) - (hour * hourSeconds)) / minuteSeconds);
    const second = (seconds - (day * daySeconds) - (hour * hourSeconds) - (minute * minuteSeconds));

    return day ? `${formatNumber(day)}d ${formatNumber(hour)}:${formatNumber(minute)}:${formatNumber(second)}` : hour ? `${formatNumber(hour)}:${formatNumber(minute)}:${formatNumber(second)}` : minute ? `${formatNumber(minute)}:${formatNumber(second)}` : second;
};

export const readLocalStorage = (key: string) => typeof window !== 'undefined' ? window.localStorage.getItem(key) : "";
export const parseJSON = (jsonString: string) => typeof window !== 'undefined' ? JSON.parse(jsonString || "{}") : {};
export const logger = createLogPrinter("@set");

export const getTimingPointIcon = (isFirst: boolean, isLast: boolean) => {
    return isFirst ? mdiRayStartArrow : isLast ? mdiFlagCheckered : mdiRayVertex;
};
