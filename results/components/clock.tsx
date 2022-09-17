import { formatTime } from "@set/utils/dist";

const Time = ({ time, fontSize }: { time: number; fontSize: number }) => (
    <div style={{ fontSize: `${fontSize}rem` }} className="leading-none text-white text-center transition-all">
        {formatTime(new Date(time))}
    </div>
);

export const Clock = ({ time, fontSize }: { time: number; fontSize: number }) => {
    return <Time time={time} fontSize={fontSize} />;
};
