export type BeepFunction = (freq?: number, duration?: number, vol?: number) => void;
export const createBeep = () => {
    if (typeof window === "undefined") return (_freq = 520, _duration = 500, _vol = 100) => undefined;

    const ContextConstructor = window.AudioContext || (window as any).webkitAudioContext;

    const context = new ContextConstructor();
    if (context.state !== "running") void context.resume();

    const runBeep = (freq: number, duration: number, vol: number) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.connect(gain);
        oscillator.frequency.value = freq;
        oscillator.type = "square";
        gain.connect(context.destination);
        gain.gain.value = vol * 0.01;
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + duration * 0.001);
    };

    return ((freq = 520, duration = 500, vol = 100) => {
        if (context.state !== "running") void context.resume();

        runBeep(freq, duration, vol);
    }) as BeepFunction;
};
