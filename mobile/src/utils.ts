import * as Arr from "fp-ts/Array";
import * as S from "fp-ts/string";
import { flow, pipe } from "fp-ts/function";

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time: Date) =>
    `${formatNumber(time.getHours())}:${formatNumber(time.getMinutes())}:${formatNumber(
        time.getSeconds()
    )}.${formatNumber(time.getMilliseconds(), 3).slice(0, 1)}`;

export const getAvailableNumbers = (typedNumbers: string, allNumbers: number[]): number[] =>
    typedNumbers !== "" ? pipe(allNumbers, Arr.filter(flow(String, S.startsWith(typedNumbers)))) : [];

export const sliceFrom = (start: number) => (string: string) => string.slice(start);

export const getAvailableDigits = (typedNumbers: string, allNumbers: number[]): string[] =>
    pipe(
        allNumbers,
        Arr.map(String),
        Arr.filter(S.startsWith(typedNumbers)),
        Arr.map(sliceFrom(typedNumbers.length)),
        Arr.map(S.slice(0, 1)),
        Arr.filter((s) => !!s)
    );

export const getCurrentTime = (offset: number) => Date.now() + offset;
