import { formatTimeWithSec } from "@set/shared/dist";

const Time = ({ time, fontSize }: { time: number; fontSize: number }) => (
    <div
        style={{ fontSize: `${fontSize}rem` }}
        className="leading-none font-mono text-white text-center transition-all"
    >
        {formatTimeWithSec(new Date(time))}
    </div>
);

export const Clock = ({ time, fontSize }: { time: number; fontSize: number }) => {
    return <Time time={time} fontSize={fontSize} />;
};
