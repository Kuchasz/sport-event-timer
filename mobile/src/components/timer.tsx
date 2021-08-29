import { useEffect, useState } from "react";

const formatNumber = (n: number, precision = 2) => n.toLocaleString('en-US', {minimumIntegerDigits: precision});

const Time = ({time}: {time: Date}) => <div className="text-6xl">{`${formatNumber(time.getHours())}:${formatNumber(time.getMinutes())}:${formatNumber(time.getSeconds())}.${formatNumber(time.getMilliseconds(), 3)}`}</div>
export const Timer = () => {

    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        setInterval(() => setTime(new Date()), 10);
    }, []);

    return <Time time={time}/>
}