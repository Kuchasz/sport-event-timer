import * as Arr from "fp-ts/Array";
import * as S from "fp-ts/string";
import { flow, pipe } from "fp-ts/function";

export const sliceFrom = (start: number) => (string: string) => string.slice(start);

export const getAvailableDigits = (typedNumbers: string, allNumbers: number[]): string[] =>
    pipe(
        allNumbers,
        Arr.map(String),
        Arr.filter(S.startsWith(typedNumbers)),
        Arr.map(sliceFrom(typedNumbers.length)),
        Arr.map(S.slice(0, 1)),
        Arr.filter(s => !!s),
    );

export const getAvailableNumbers = (typedNumbers: string, allNumbers: number[]): number[] =>
    typedNumbers !== "" ? pipe(allNumbers, Arr.filter(flow(String, S.startsWith(typedNumbers)))) : [];

export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
