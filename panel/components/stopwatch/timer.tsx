import { splitTime } from "@set/shared/dist/utils";
import { useEffect, useState } from "react";

const Time = ({ time }: { time: number }) => {
    const splits = splitTime(new Date(time));

    return (
        <div className="text-3xl flex items-end">
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">HRS</div>
                <div className="text-center font-normal w-10">{splits.hours}</div>
            </div>
            <div className="px-1 text-orange-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">MINS</div>
                <div className="text-center font-normal w-10">{splits.minutes}</div>
            </div>
            <div className="px-1 text-orange-600">:</div>
            <div className="flex flex-col items-center">
                <div className="text-xs text-zinc-600">SECS</div>
                <div className="text-center font-normal w-10">{splits.seconds}</div>
            </div>
            <div className="-ml-0.5">.</div>
            <div className="text-center text-xl font-normal">{splits.miliseconds}</div>
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
