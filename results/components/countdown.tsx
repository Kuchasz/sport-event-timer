import classNames from "classnames";
import { getCountdownTime, timeSeconds } from "@set/shared/dist";
import { useEffect, useState } from "react";

const Time = ({ time, fontSize }: { time: number; fontSize: number }) => {
    // const t = currentTime.getSeconds() * 1000;
    const countdownSeconds = getCountdownTime(time);
    const formatedTime = timeSeconds(countdownSeconds);

    return (
        <div
            style={{ fontSize: `${fontSize}vh`, lineHeight: 0.5 }}
            className={classNames(["font-mono flex grow flex-col justify-center font-black transition-all"], {
                ["text-white"]: countdownSeconds > 4,
                ["text-orange-500"]: countdownSeconds <= 4
            })}
        >
            {formatedTime}
        </div>
    );
};

const secondsToPlay = [0, 1, 2, 3, 4, 5];
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
            const offsetTime = Date.now() + offset;
            const now = new Date(getCountdownTime(offsetTime));

            const seconds = now.getSeconds();
            const miliseconds = 1_000 - now.getMilliseconds();

            if (beep && secondsToPlay.includes(seconds) && miliseconds <= clockTimeout) {
                const frequency = secondsToPlay[0] === seconds ? 784 : 523;
                console.log(seconds);
                beep(frequency, seconds === 0 ? 1000 : 500, seconds === 5 ? 0.1 : 100);
            }

            setTime(offsetTime);
        }, clockTimeout);

        return () => {
            clearInterval(interval);
        };
    }, [offset, beep]);

    return <Time time={time} fontSize={fontSize} />;
};
