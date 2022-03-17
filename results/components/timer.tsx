import { formatTimeNoSec } from "../utils";
import { useEffect, useState } from "react";

const Time = ({ time }: { time: number }) => (
    <div className="text-white text-center text-8xl">{formatTimeNoSec(new Date(time))}</div>
);

export const Timer = ({ offset }: { offset: number }) => {
    const [time, setTime] = useState<number>(Date.now() + offset);

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now() + offset), 100);

        return () => clearInterval(interval);
    }, [offset]);

    return <Time time={time} />;
};
