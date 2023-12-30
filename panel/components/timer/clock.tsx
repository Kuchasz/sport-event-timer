import { formatTimeWithMilliSec, formatTimeWithSec } from "@set/utils/dist/datetime";

const Time = ({ className, time, fontSize, full = false }: { className?: string; time: number; fontSize?: number; full?: boolean }) => (
    <div
        style={{ fontSize: fontSize ? `${fontSize}rem` : undefined }}
        className={`${className} self-center p-2 text-center font-mono leading-none transition-all`}>
        {full ? formatTimeWithMilliSec(time) : formatTimeWithSec(time)}
    </div>
);

export const Clock = ({
    className,
    time,
    fontSize,
    full = false,
}: {
    className?: string;
    time: number;
    fontSize?: number;
    full?: boolean;
}) => {
    return <Time className={className} time={time} fontSize={fontSize} full={full} />;
};
