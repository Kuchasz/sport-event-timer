import { formatTimeWithSec } from "../utils/dist";

const Time = ({ time, fontSize }: { time: number; fontSize: number }) => (
    <div
        style={{ fontSize: `${fontSize}rem` }}
        className="leading-none font-mono text-white text-center transition-all"
    >
        {formatTimeWithSec(time)}
    </div>
);

export const Clock = ({ time, fontSize }: { time: number; fontSize: number }) => {
    return <Time time={time} fontSize={fontSize} />;
};
