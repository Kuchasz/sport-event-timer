import { formatTimeWithMilliSec, formatTimeWithSec } from "@set/utils/dist/datetime";
import { type CSSProperties } from "react";

const Time = ({
    style,
    className,
    time,
    fontSize,
    full = false,
}: {
    style?: CSSProperties;
    className?: string;
    time: number;
    fontSize?: number;
    full?: boolean;
}) => (
    <div
        style={{ fontSize: fontSize ? `${fontSize}rem` : undefined, ...style }}
        className={`${className} self-center p-2 text-center font-mono leading-none transition-all`}>
        {full ? formatTimeWithMilliSec(time) : formatTimeWithSec(time)}
    </div>
);

export const Clock = ({
    style,
    className,
    time,
    fontSize,
    full = false,
}: {
    style?: CSSProperties;
    className?: string;
    time: number;
    fontSize?: number;
    full?: boolean;
}) => {
    return <Time style={style} className={className} time={time} fontSize={fontSize} full={full} />;
};
