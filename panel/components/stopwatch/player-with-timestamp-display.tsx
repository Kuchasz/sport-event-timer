import { formatTime } from "@set/utils/dist/datetime";
import { formatNumber } from "@set/utils/dist/number";
import type { Absence, Player, TimeStamp } from "@set/timer/dist/model";
import classNames from "classnames";
import { usePreviousValue } from "hooks";
import { useTranslations } from "next-intl";

type PlayerWithTimeStamp = Player & {
    timeStamp?: TimeStamp;
    absent?: Absence;
};

export const PlayerWithTimeStampDisplay = ({
    padBibNumber,
    playerWithTimeStamp,
}: {
    padBibNumber: number;
    playerWithTimeStamp: Partial<PlayerWithTimeStamp>;
}) => {
    const previousTimeStamp = usePreviousValue(playerWithTimeStamp.timeStamp?.time);
    const previousAbsentState = usePreviousValue(playerWithTimeStamp.absent);

    const t = useTranslations();

    return (
        <span className="flex h-10 grow items-center">
            {playerWithTimeStamp.bibNumber !== undefined ? (
                <span className="text-md mr-4 rounded-full bg-zinc-100 p-2 font-mono font-semibold leading-none text-zinc-600 ">
                    {formatNumber(playerWithTimeStamp.bibNumber, padBibNumber)}
                </span>
            ) : null}

            <span className="grow text-xs">
                <div
                    className={classNames("overflow-hidden text-sm font-semibold text-black transition-all duration-300", {
                        ["max-h-0 opacity-0"]: playerWithTimeStamp.timeStamp == null,
                        ["max-h-[18px] opacity-100"]: playerWithTimeStamp.timeStamp,
                    })}>
                    <span>
                        {playerWithTimeStamp.timeStamp
                            ? formatTime(new Date(playerWithTimeStamp.timeStamp.time))
                            : previousTimeStamp
                            ? formatTime(new Date(previousTimeStamp))
                            : null}
                    </span>
                </div>
                <div
                    className={classNames("overflow-hidden text-sm font-semibold text-black transition-all duration-300", {
                        ["max-h-0 opacity-0"]: playerWithTimeStamp.absent == null,
                        ["max-h-[18px] opacity-100"]: playerWithTimeStamp.absent,
                    })}>
                    <span className="uppercase">
                        {playerWithTimeStamp.absent ? t("stopwatch.list.absent") : previousAbsentState ? t("stopwatch.list.absent") : null}
                    </span>
                </div>
                <div
                    className={classNames(
                        "font-medium text-zinc-400 transition-all",
                        playerWithTimeStamp.timeStamp || playerWithTimeStamp.absent ? "text-2xs" : "text-sm",
                    )}>
                    <span className="text-ellipsis">{playerWithTimeStamp.name}</span> {playerWithTimeStamp.lastName}
                </div>
            </span>
        </span>
    );
};
