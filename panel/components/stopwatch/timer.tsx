import { splitTime } from "@set/utils/dist/datetime";
import { useEffect, useState } from "react";

const Time = ({ time }: { time: number }) => {
    const splits = splitTime(new Date(time));

    return (
        <div className="text-3xl flex items-end">
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">HRS</div>
                <div className="font-mono text-center font-normal w-10">{splits.hours}</div>
            </div>
            <div className="px-1 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">MINS</div>
                <div className="font-mono text-center font-normal w-10">{splits.minutes}</div>
            </div>
            <div className="px-1 text-zinc-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">SECS</div>
                <div className="font-mono text-center font-normal w-10">{splits.seconds}</div>
            </div>
            <div className="-ml-0.5 text-zinc-500">.</div>
            <div className="font-mono text-center text-orange-500 text-xl font-bold">{splits.miliseconds}</div>
        </div>
    );
};

export const Timer = ({ offset }: { offset: number }) => {
    const [time, setTime] = useState<number>(Date.now() + offset);

    useEffect(() => {
        console.log(offset);
        const interval = setInterval(() => setTime(Date.now() + offset), 100);

        return () => clearInterval(interval);
    }, [offset]);

    return <Time time={time} />;
};
