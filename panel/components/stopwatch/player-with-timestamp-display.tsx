import { formatTime } from "@set/utils/dist/datetime";
import { formatNumber } from "@set/utils/dist/number";
import type { Absence, Player, TimeStamp } from "@set/timer/dist/model";
import classNames from "classnames";
import { usePreviousValue } from "hooks";
import { useTranslations } from "next-intl";
import Icon from "@mdi/react";
import { mdiAccountAlertOutline } from "@mdi/js";

type PlayerWithTimeStamp = Player & {
    timeStamp: TimeStamp;
    timeStamps: Record<number, number>;
    absent?: Absence;
};

export const PlayerWithTimeStampDisplay = ({
    padLeftBibNumber,
    playerWithTimeStamp,
    onAssign,
    displayLaps,
}: {
    padLeftBibNumber: number;
    playerWithTimeStamp: Partial<PlayerWithTimeStamp>;
    onAssign?: () => void;
    displayLaps?: boolean;
}) => {
    const previousTimeStamp = usePreviousValue(playerWithTimeStamp.timeStamp?.time);
    const previousAbsentState = usePreviousValue(playerWithTimeStamp.absent);

    const lastTimeStamp = playerWithTimeStamp.timeStamp;

    const bibText = padLeftBibNumber
        ? ".".repeat(padLeftBibNumber - padLeftBibNumber.toString().length) + padLeftBibNumber
        : playerWithTimeStamp.bibNumber?.toString() ?? "";

    const t = useTranslations();

    return (
        <span className="flex h-10 grow items-center">
            {playerWithTimeStamp.bibNumber !== undefined ? (
                <span
                    onClick={onAssign}
                    className="text-md mr-4 rounded-full bg-zinc-100 p-2 font-mono font-semibold leading-none text-zinc-600 ">
                    {formatNumber(playerWithTimeStamp.bibNumber, padLeftBibNumber)}
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
                    {displayLaps && playerWithTimeStamp.timeStamps && playerWithTimeStamp.timeStamp && (
                        <span className="mr-2">
                            {t("stopwatch.list.lap")}
                            {playerWithTimeStamp.timeStamps[playerWithTimeStamp.timeStamp.id] + 1}
                        </span>
                    )}
                    <span>
                        {lastTimeStamp
                            ? formatTime(new Date(lastTimeStamp.time))
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
                        lastTimeStamp || playerWithTimeStamp.absent ? "text-xs" : "text-sm",
                    )}>
                    <span className="text-ellipsis">{playerWithTimeStamp.name}</span> {playerWithTimeStamp.lastName}
                </div>
            </span>
        </span>
    );
};
