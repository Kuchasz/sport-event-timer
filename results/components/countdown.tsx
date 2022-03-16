import classNames from "classnames";
import { formatTimeSeconds } from "../utils";
import { useEffect, useState } from "react";

const Time = ({ time }: { time: number }) => {
    const currentTime = new Date(time);

    const t = 60 * 1000 - (currentTime.getSeconds() * 1000 + currentTime.getMilliseconds());

    const formatedTime = Number(formatTimeSeconds(t));

    return (
        <div
            style={{ fontSize: "90vh", lineHeight: "1" }}
            className={classNames(["font-mono font-black"], {
                ["text-white"]: formatedTime > 10,
                ["text-red-700"]: formatedTime <= 10
            })}
        >
            {formatedTime}
        </div>
    );
};

// const beep = createBeep();

const secondsToPlay = [56, 57, 58, 59];
const clockTimeout = 100;

export const Countdown = ({ offset }: { offset: number }) => {
    const [time, setTime] = useState<number>(Date.now() + offset);

    useEffect(() => {
        const ro = new ResizeObserver((e) => {
            console.log(e);
        });

        ro.observe(document.body);

        const interval = setInterval(() => {
            const now = new Date();

            const seconds = now.getSeconds();
            const miliseconds = now.getMilliseconds();

            if (secondsToPlay.includes(seconds) && miliseconds <= clockTimeout) {
                console.log(seconds);
                // const frequency = secondsToPlay.slice(-1)[0] === seconds ? 784 : 523;
                // beep(frequency, 500);
            }

            setTime(Date.now() + offset);
        }, clockTimeout);

        return () => clearInterval(interval);
    }, [offset]);

    return <Time time={time} />;
};
