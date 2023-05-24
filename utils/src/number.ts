export const inRange = (range: { from: number; to: number }, n: number) => range.from <= n && range.to >= n;

export const rangeLength = (range: { from: number; to: number }) => range.to - range.from + 1;

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });