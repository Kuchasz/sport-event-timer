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

export const timeSeconds = (timeMs: number) => new Date(timeMs).getSeconds();

export const getCurrentTime = (offset: number) => Date.now() + offset;

export function sort<T>(items: T[], func: (item: T) => number): T[] {
    const i = [...items];

    return i.sort((a, b) => func(a) - func(b));
}

export function sortDesc<T>(items: T[], func: (item: T) => number): T[] {
    const i = [...items];

    return i.sort((a, b) => func(b) - func(a));
}

export type PlayerResult = { number: number; result?: number; status: string };
export type UserCredentials = { login: string; password: string };
export type LoginResult = { authToken: string; issuedAt: number; expireDate: number };
export type ClockListPlayer = { number: number; name: string; lastName: string; startTime: number };
