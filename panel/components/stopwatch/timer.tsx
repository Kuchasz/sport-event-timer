import { formatTime } from "@set/shared/dist/utils";
import { useEffect, useState } from "react";

const Time = ({ time }: { time: number }) => <div className="bg-zinc-300 px-3 py-1 rounded-full font-mono text-xl">{formatTime(new Date(time))}</div>;

export const Timer = ({ offset }: { offset: number }) => {
    const [time, setTime] = useState<number>(Date.now() + offset);

    useEffect(() => {
        console.log(offset);
        const interval = setInterval(() => setTime(Date.now() + offset), 100);

        return () => clearInterval(interval);
    }, [offset]);

    return <Time time={time} />;
};
