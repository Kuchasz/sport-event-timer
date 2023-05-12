const secondMillis = 1_000;
const minuteMillis = secondMillis * 60;
const hourMillis = minuteMillis * 60;

export const getCurrentTime = (offset: number) => Date.now() + offset;
export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time: Date) =>
    `${formatNumber(time.getHours())}:${formatNumber(time.getMinutes())}:${formatNumber(
        time.getSeconds()
    )}.${formatNumber(time.getMilliseconds(), 3).slice(0, 1)}`;

export const splitTime = (time: Date) => ({
    hours: formatNumber(time.getHours()), minutes: formatNumber(time.getMinutes()), seconds: formatNumber(
        time.getSeconds()
    ), miliseconds: formatNumber(time.getMilliseconds(), 3).slice(0, 1)
});

export const getCountdownTime = (time: number) => {
    const currentTime = new Date(time);

    return 60_000 - (currentTime.getSeconds() * 1000 + currentTime.getMilliseconds());
};

export const timeOnlyFormatTimeNoSec = (time?: number) => {
    if (!time) return "--:--";
    
    const timeStampAsDate = new Date(time);
    const offset = timeStampAsDate.getTimezoneOffset();

    const dateTime = new Date(time + offset * 60_000);

    return `${formatNumber(dateTime.getHours())}:${formatNumber(dateTime.getMinutes())}`;
};

export const formatTimeWithSec = (time?: number) => {
    if (!time) return "--:--:--";
    const dateTime = new Date(time);
    return `${formatNumber(dateTime.getHours())}:${formatNumber(dateTime.getMinutes())}:${formatNumber(
        dateTime.getSeconds()
    )}`;
};

export const formatTimeWithMilliSec = (time?: number) => {
    if (!time) return "--:--:--.---";
    const dateTime = new Date(time);
    return `${formatNumber(dateTime.getHours())}:${formatNumber(dateTime.getMinutes())}:${formatNumber(
        dateTime.getSeconds()
    )}.${formatNumber(dateTime.getMilliseconds()).padStart(3, "0")}`;
};

export const formatTimeWithMilliSecUTC = (time?: number) => {
    if (!time) return "--:--:--.---";
    const dateTime = new Date(time);
    return `${formatNumber(dateTime.getUTCHours())}:${formatNumber(dateTime.getMinutes())}:${formatNumber(
        dateTime.getSeconds()
    )}.${formatNumber(dateTime.getMilliseconds()).padStart(3, "0")}`;
};

export const timeSeconds = (timeMs: number) => new Date(timeMs).getSeconds();

export const milisecondsToTimeString = (miliseconds: number | undefined | null) => {
    if (miliseconds === null || miliseconds === undefined) return "";
    const hours = Math.floor(miliseconds / hourMillis);
    const minutes = Math.floor((miliseconds - hours * hourMillis) / minuteMillis);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

export const daysFromNow = (days: number) => new Date(new Date().getTime() + days * 86_400_000);

export const calculateAge = (birthDate: Date): number => {
    const now = new Date();
    const diff = now.getTime() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }