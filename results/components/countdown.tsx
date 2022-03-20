import classNames from "classnames";
import { createBeep, formatTimeSeconds } from "../utils";
import { useEffect, useState } from "react";

const Time = ({ time, fontSize }: { time: number; fontSize: number }) => {
    const currentTime = new Date(time);

    const t = 60 * 1000 - (currentTime.getSeconds() * 1000 + currentTime.getMilliseconds());
    // const t = currentTime.getSeconds() * 1000;

    const formatedTime = Number(formatTimeSeconds(t));

    return (
        <div
            style={{ fontSize: `${fontSize}vh`, lineHeight: 0.5 }}
            className={classNames(["font-mono flex flex-grow flex-col justify-center font-black transition-all"], {
                ["text-white"]: formatedTime > 3,
                ["text-orange-500"]: formatedTime <= 3
            })}
        >
            {formatedTime}
        </div>
    );
};

const beep = createBeep();

const secondsToPlay = [56, 57, 58, 59];
const clockTimeout = 100;

export const Countdown = ({
    offset,
    fontSize,
    soundEnabled
}: {
    offset: number;
    fontSize: number;
    soundEnabled: boolean;
}) => {
    const [time, setTime] = useState<number>(Date.now() + offset);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            const seconds = now.getSeconds();
            const miliseconds = now.getMilliseconds();

            if (soundEnabled && secondsToPlay.includes(seconds) && miliseconds <= clockTimeout) {
                const frequency = secondsToPlay.slice(-1)[0] === seconds ? 784 : 523;
                beep(frequency, 500);
            }

            setTime(Date.now() + offset);
        }, clockTimeout);

        return () => {
            clearInterval(interval);
        };
    }, [offset, soundEnabled]);

    return <Time time={time} fontSize={fontSize} />;
};
