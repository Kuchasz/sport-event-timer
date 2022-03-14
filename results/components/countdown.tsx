import { formatTimeSeconds } from "../utils";
import { useEffect, useState } from "react";

const Time = ({ time }: { time: number }) => {
    const currentTime = new Date(time);

    const t = 60 * 1000 - (currentTime.getSeconds() * 1000 + currentTime.getMilliseconds());

    return (
        <div style={{ fontSize: "90vh", lineHeight: "1" }} className="text-white">
            {formatTimeSeconds(t)}
        </div>
    );
};

let lastPlayMinute: number;

export const Countdown = ({ offset }: { offset: number }) => {
    const [time, setTime] = useState<number>(Date.now() + offset);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (now.getSeconds() === 56 && lastPlayMinute !== now.getMinutes()) {
                lastPlayMinute = now.getMinutes();
                new Audio("/assets/sport-beep.wav").play();
            }

            setTime(Date.now() + offset);
        }, 100);

        return () => clearInterval(interval);
    }, [offset]);

    return <Time time={time} />;
};
