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
            style={{ fontSize: `${fontSize}vh`, lineHeight: "0.7" }}
            className={classNames(["font-mono flex flex-grow flex-col justify-center font-black transition-all"], {
                ["text-white"]: formatedTime > 10,
                ["text-orange-700"]: formatedTime <= 10
            })}
        >
            {formatedTime}
        </div>
    );
};

const beep = createBeep();

const secondsToPlay = [56, 57, 58, 59];
const clockTimeout = 100;

export const Countdown = ({ offset, fontSize }: { offset: number; fontSize: number }) => {
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
                const frequency = secondsToPlay.slice(-1)[0] === seconds ? 784 : 523;
                beep(frequency, 500);
            }

            setTime(Date.now() + offset);
        }, clockTimeout);

        return () => {
            clearInterval(interval);
            ro.disconnect();
        };
    }, [offset]);

    return <Time time={time} fontSize={fontSize} />;
};
