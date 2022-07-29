import classNames from "classnames";
import { useEffect } from "react";

const secondsToPlay = [0, 1, 2, 3, 4, 5];

export const Countdown = ({
    seconds,
    fontSize,
    beep
}: {
    seconds: number;
    fontSize: number;
    beep?: (freq?: number, duration?: number, vol?: number) => void;
}) => {
    useEffect(() => {
        if (beep && secondsToPlay.includes(seconds)) {
            const config = {
                frequency: secondsToPlay[0] === seconds ? 784 : 523,
                duration: seconds === 0 ? 1000 : 500,
                volume: seconds === 5 ? 0.1 : 100
            };

            beep(config.frequency, config.duration, config.volume);
        }
    }, [seconds, beep]);

    return (
        <>
            <div
                style={{ fontSize: `${fontSize}vh`, lineHeight: 0.5 }}
                className={classNames(
                    ["hidden wide:flex font-mono grow flex-col justify-center font-black transition-all"],
                    {
                        ["text-white"]: seconds > 4,
                        ["text-orange-500"]: seconds <= 4
                    }
                )}
            >
                {seconds}
            </div>
            <div
                style={{ fontSize: `${fontSize}vw`, lineHeight: 0.5 }}
                className={classNames(
                    ["hidden tall:flex font-mono grow flex-col justify-center font-black transition-all"],
                    {
                        ["text-white"]: seconds > 4,
                        ["text-orange-500"]: seconds <= 4
                    }
                )}
            >
                {seconds}
            </div>
        </>
    );
};
