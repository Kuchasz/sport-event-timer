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

export const formatTimeNoSec = (time: Date) => `${formatNumber(time.getHours())}:${formatNumber(time.getMinutes())}`;

export const formatTimeSeconds = (timeMs: number) => `${formatNumber(Math.floor(timeMs / 1000), 1)}`;

export const getCurrentTime = (offset: number) => Date.now() + offset;

export function sort<T>(items: T[], func: (item: T) => number): T[] {
    const i = [...items];

    return i.sort((a, b) => func(a) - func(b));
}

export type UserCredentials = { login: string; password: string };
export type LoginResult = { authToken: string; issuedAt: number; expireDate: number };
export type ClockListPlayer = { number: number; name: string; lastName: string; startTime: number };
