import { formatTimeNoSec } from "@set/shared/dist";
import { useEffect, useState } from "react";

const Time = ({ time, fontSize }: { time: number; fontSize: number }) => (
    <div style={{ fontSize: `${fontSize}rem` }} className="leading-none text-white text-center transition-all">
        {formatTimeNoSec(new Date(time))}
    </div>
);

export const Timer = ({ offset, fontSize }: { offset: number; fontSize: number }) => {
    const [time, setTime] = useState<number>(Date.now() + offset);

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now() + offset), 100);

        return () => clearInterval(interval);
    }, [offset]);

    return <Time time={time} fontSize={fontSize} />;
};
