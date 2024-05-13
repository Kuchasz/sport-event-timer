export const inRange = (range: { from: number; to: number }, n: number) => range.from <= n && range.to >= n;

export const rangeLength = (range: { from: number; to: number }) => range.to - range.from + 1;

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision, useGrouping: false });

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const calculateMedian = (numbers: number[]) => {
    const sortedNumbers = numbers.slice().sort((a, b) => a - b);
    const length = sortedNumbers.length;

    if (numbers.length === 0) return 0;

    if (length % 2 === 0) {
        const middleIndex = length / 2;
        return (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2;
    } else {
        const middleIndex = Math.floor(length / 2);
        return sortedNumbers[middleIndex];
    }
};
