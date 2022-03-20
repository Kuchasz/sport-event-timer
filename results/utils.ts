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

export const createBeep = () => {
    if (typeof window === "undefined") return (_freq = 520, _duration = 500, _vol = 100) => undefined;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "square";

    oscillator.connect(gain);
    oscillator.start(context.currentTime);

    return (freq = 520, duration = 500, vol = 100) => {
        oscillator.frequency.value = freq;
        gain.gain.value = vol * 0.01;

        gain.connect(context.destination);
        setTimeout(() => gain.disconnect(context.destination), duration);
        // oscillator.stop(context.currentTime + duration * 0.001);
    };
};
