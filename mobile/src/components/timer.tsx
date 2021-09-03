import { formatTime } from "../utils";
import { useEffect, useState } from "react";

const Time = ({ time }: { time: Date }) => <div className="text-xl">{formatTime(time)}</div>;

export const Timer = () => {
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        setInterval(() => setTime(new Date()), 10);
    }, []);

    return <Time time={time} />;
};
