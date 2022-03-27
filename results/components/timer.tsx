import { formatTimeNoSec } from "@set/shared/dist";

const Time = ({ time, fontSize }: { time: number; fontSize: number }) => (
    <div style={{ fontSize: `${fontSize}rem` }} className="leading-none text-white text-center transition-all">
        {formatTimeNoSec(new Date(time))}
    </div>
);

export const Timer = ({ time, fontSize }: { time: number; fontSize: number }) => {
    return <Time time={time} fontSize={fontSize} />;
};
