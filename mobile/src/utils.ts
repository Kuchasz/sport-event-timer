import * as R from "ramda";

export const formatNumber = (n: number, precision = 2) =>
    n.toLocaleString("en-US", { minimumIntegerDigits: precision });

export const formatTime = (time: Date) =>
    `${formatNumber(time.getHours())}:${formatNumber(time.getMinutes())}:${formatNumber(
        time.getSeconds()
    )}.${formatNumber(time.getMilliseconds(), 3).slice(0, 1)}`;

export const getAvailableDigits = (typedNumbers: string, allNumbers: string[]): string[] => {
    const unc = <any>(
        R.compose(
            R.map(R.compose(R.head, R.last)),
            R.map(R.splitAt(typedNumbers.length)),
            R.filter<string, "array">(R.startsWith(typedNumbers))
        )
    );

    return unc(allNumbers);
};
