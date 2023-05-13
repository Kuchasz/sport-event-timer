import { formatTimeWithMilliSec, formatTimeWithSec } from "@set/utils/dist/datetime";

const Time = ({ time, fontSize, full = false }: { time: number; fontSize: number, full?: boolean }) => (
    <div
        style={{ fontSize: `${fontSize}rem` }}
        className="leading-none p-2 self-center font-mono text-white text-center transition-all"
    >
        {full ? formatTimeWithMilliSec(time) : formatTimeWithSec(time)}
    </div>
);

export const Clock = ({ time, fontSize, full = false }: { time: number; fontSize: number, full?: boolean }) => {
    return <Time time={time} fontSize={fontSize} full={full}/>;
};
