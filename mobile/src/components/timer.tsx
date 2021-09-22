import { formatTime } from "../utils";
import { useEffect, useState } from "react";

const Time = ({ time }: { time: number }) => <div className="w-24 text-xl">{formatTime(new Date(time))}</div>;

export const Timer = ({ offset }: { offset: number }) => {
    const [time, setTime] = useState<number>(Date.now() + offset);

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now() + offset), 10);

        return () => clearInterval(interval);
    }, [offset]);

    return <Time time={time} />;
};
