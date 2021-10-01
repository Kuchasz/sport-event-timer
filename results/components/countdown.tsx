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

export const Countdown = ({ offset }: { offset: number }) => {
    const [time, setTime] = useState<number>(Date.now() + offset);

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now() + offset), 100);

        return () => clearInterval(interval);
    }, [offset]);

    return <Time time={time} />;
};
