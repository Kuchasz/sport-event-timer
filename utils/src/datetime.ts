
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

export const formatTimeNoSec = (time?: number) => {
    if (!time) return "--:--";
    const dateTime = new Date(time);
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