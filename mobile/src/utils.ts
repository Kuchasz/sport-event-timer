import * as Arr from "fp-ts/Array";
import * as S from "fp-ts/string";
import { pipe } from "fp-ts/function";

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time: Date) =>
    `${formatNumber(time.getHours())}:${formatNumber(time.getMinutes())}:${formatNumber(
        time.getSeconds()
    )}.${formatNumber(time.getMilliseconds(), 3).slice(0, 1)}`;

export const getAvailableNumbers = (typedNumbers: string, allNumbers: string[]): string[] =>
    pipe(allNumbers, Arr.filter(S.startsWith(typedNumbers)));

export const getAvailableDigits = (typedNumbers: string, allNumbers: string[]): string[] =>
    pipe(
        allNumbers,
        Arr.filter(S.startsWith(typedNumbers)),
        Arr.map((e) => S.slice(typedNumbers.length, e.length)(e)),
        Arr.map(S.slice(0, 1)),
        Arr.filter((s) => !!s)
    );
