export const unreliablyGetIsMobile = () => {
    if (typeof window === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time: Date) =>
    `${formatNumber(time.getHours())}:${formatNumber(time.getMinutes())}:${formatNumber(
        time.getSeconds()
    )}.${formatNumber(time.getMilliseconds(), 3).slice(0, 1)}`;

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

export const timeSeconds = (timeMs: number) => new Date(timeMs).getSeconds();

export const areOverlapping = (A: { from: number; to: number }, B: { from: number; to: number }) => {
    if (B.from <= A.from) {
        return B.to >= A.from;
    } else {
        return B.from <= A.to;
    }
};

export const inRange = (range: { from: number; to: number }, n: number) => range.from <= n && range.to >= n;

export const rangeLength = (range: { from: number; to: number }) => range.to - range.from;

export const createRange = (range: { from: number; to: number }) =>
    Array.from({ length: rangeLength(range) }, (_, i) => range.from + i);

export const getCurrentTime = (offset: number) => Date.now() + offset;

export const sort = <T>(items: T[], func: (item: T) => number): T[] => {
    const i = [...items];

    return i.sort((a, b) => func(a) - func(b));
};

export const sortDesc = <T>(items: T[], func: (item: T) => number): T[] => {
    const i = [...items];

    return i.sort((a, b) => func(b) - func(a));
};

export const arrayRange = (startNumber: number, endNumber: number) =>
    [...Array(1 + endNumber - startNumber).keys()].map(v => startNumber + v);

export const uuidv4 = () => {
    let d = new Date().getTime();
    let d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0;
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        var r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
};

export type PlayerResult = { number: number; result?: number; status: string };
export type UserCredentials = { login: string; password: string };
export type LoginResult = { authToken: string; issuedAt: number; expireDate: number };
export type ClockListPlayer = { number: number; name: string; lastName: string; startTime: number };
