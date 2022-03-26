import classNames from "classnames";
import { formatTimeSeconds } from "../utils";
import { useEffect, useState } from "react";

const Time = ({ time, fontSize }: { time: number; fontSize: number }) => {
    const currentTime = new Date(time);

    const t = 60 * 1000 - (currentTime.getSeconds() * 1000 + currentTime.getMilliseconds());
    // const t = currentTime.getSeconds() * 1000;

    const formatedTime = Number(formatTimeSeconds(t));

    return (
        <div
            style={{ fontSize: `${fontSize}vh`, lineHeight: 0.5 }}
            className={classNames(["font-mono flex grow flex-col justify-center font-black transition-all"], {
                ["text-white"]: formatedTime > 4,
                ["text-orange-500"]: formatedTime <= 4
            })}
        >
            {formatedTime}
        </div>
    );
};

const secondsToPlay = [54, 55, 56, 57, 58, 59];
const clockTimeout = 100;

export const Countdown = ({
    offset,
    fontSize,
    beep
}: {
    offset: number;
    fontSize: number;
    beep?: (freq?: number, duration?: number, vol?: number) => void;
}) => {
    const [time, setTime] = useState<number>(Date.now() + offset);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();

            const seconds = now.getSeconds();
            const miliseconds = now.getMilliseconds();

            if (beep && secondsToPlay.includes(seconds) && miliseconds <= clockTimeout) {
                console.log(seconds);
                const frequency = secondsToPlay.slice(-1)[0] === seconds ? 784 : 523;
                beep(frequency, seconds === 59 ? 1000 : 500, seconds === 54 ? 1 : 100);
            }

            setTime(Date.now() + offset);
        }, clockTimeout);

        return () => {
            clearInterval(interval);
        };
    }, [offset, beep]);

    return <Time time={time} fontSize={fontSize} />;
};
