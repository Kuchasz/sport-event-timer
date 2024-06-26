import { formatTime } from "@set/utils/dist/datetime";
import { formatNumber } from "@set/utils/dist/number";
import type { Absence, Player, SplitTime } from "@set/timer/dist/model";
import classNames from "classnames";
import { usePreviousValue } from "src/hooks";
import { useTranslations } from "next-intl";
import Icon from "@mdi/react";
import { mdiAccountAlertOutline } from "@mdi/js";

type PlayerWithTimeStamp = Player & {
    splitTime: SplitTime;
    absent?: Absence;
    splitName?: string;
};

export const PlayerWithSplitTimeDisplay = ({
    showSplit = false,
    padLeftBibNumber,
    playerWithSplitTime,
    onAssign,
}: {
    showSplit: boolean;
    padLeftBibNumber: number;
    playerWithSplitTime: Partial<PlayerWithTimeStamp>;
    onAssign?: () => void;
}) => {
    const previousTimeStamp = usePreviousValue(playerWithSplitTime.splitTime?.time);
    const previousAbsentState = usePreviousValue(playerWithSplitTime.absent);

    const lastTimeStamp = playerWithSplitTime.splitTime;

    const bibText = padLeftBibNumber
        ? ".".repeat(padLeftBibNumber - padLeftBibNumber.toString().length) + padLeftBibNumber
        : playerWithSplitTime.bibNumber?.toString() ?? "";

    const t = useTranslations();

    return (
        <span className="flex h-10 grow items-center">
            {playerWithSplitTime.bibNumber !== undefined ? (
                <span
                    onClick={onAssign}
                    className="text-md mr-4 rounded-full bg-zinc-100 p-2 font-mono font-semibold leading-none text-zinc-600 ">
                    {formatNumber(playerWithSplitTime.bibNumber, padLeftBibNumber)}
                </span>
            ) : (
                <span
                    onClick={onAssign}
                    className="text-md relative mr-4 flex flex-col items-center justify-center rounded-full bg-red-500 p-2 font-mono font-semibold leading-none text-white">
                    <span className="font-mono opacity-0">{bibText}</span>
                    <Icon className="absolute" size={0.8} path={mdiAccountAlertOutline}></Icon>
                </span>
            )}

            <span className="grow text-xs">
                <div
                    className={classNames("overflow-hidden text-sm font-semibold text-black transition-all duration-300", {
                        ["max-h-0 opacity-0"]: lastTimeStamp == null,
                        ["max-h-[18px] opacity-100"]: lastTimeStamp,
                    })}>
                    <span className="flex">
                        {lastTimeStamp
                            ? formatTime(new Date(lastTimeStamp.time))
                            : previousTimeStamp
                            ? formatTime(new Date(previousTimeStamp))
                            : null}

                        {showSplit && playerWithSplitTime.splitTime && (
                            <span className="flex flex-grow items-center justify-end">
                                <span className="block size-3 shrink-0 rounded-full bg-yellow-300"></span>
                                <span className="ml-1 mr-2 text-xs text-zinc-700">{playerWithSplitTime.splitName}</span>
                            </span>
                        )}
                    </span>
                </div>

                <div
                    className={classNames("overflow-hidden text-sm font-semibold text-black transition-all duration-300", {
                        ["max-h-0 opacity-0"]: playerWithSplitTime.absent == null,
                        ["max-h-[18px] opacity-100"]: playerWithSplitTime.absent,
                    })}>
                    <span className="uppercase">
                        {playerWithSplitTime.absent ? t("stopwatch.list.absent") : previousAbsentState ? t("stopwatch.list.absent") : null}
                    </span>
                </div>
                <div
                    className={classNames(
                        "font-medium text-zinc-400 transition-all",
                        lastTimeStamp || playerWithSplitTime.absent ? "text-xs" : "text-sm",
                    )}>
                    <span className="text-ellipsis">{playerWithSplitTime.name}</span> {playerWithSplitTime.lastName}
                </div>
            </span>
        </span>
    );
};
