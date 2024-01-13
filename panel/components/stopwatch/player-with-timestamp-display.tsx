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
        <span className="flex h-12 grow items-center">
            {playerWithTimeStamp.bibNumber !== undefined ? (
                <span className="mr-4 font-mono text-3xl leading-none">{formatNumber(playerWithTimeStamp.bibNumber, padBibNumber)}</span>
            ) : null}

            <span className="grow">
                <div
                    className={classNames("overflow-hidden font-semibold transition-all duration-300", {
                        ["max-h-0 opacity-0"]: playerWithTimeStamp.timeStamp == null,
                        ["max-h-8 opacity-100"]: playerWithTimeStamp.timeStamp,
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
                    className={classNames("overflow-hidden font-semibold transition-all duration-300", {
                        ["max-h-0 opacity-0"]: playerWithTimeStamp.absent == null,
                        ["max-h-8 opacity-100"]: playerWithTimeStamp.absent,
                    })}>
                    <span className="uppercase">
                        {playerWithTimeStamp.absent ? t("stopwatch.list.absent") : previousAbsentState ? t("stopwatch.list.absent") : null}
                    </span>
                </div>
                <div className="text-xs font-semibold text-gray-400 opacity-75">
                    <span className="text-ellipsis">{playerWithTimeStamp.name}</span> {playerWithTimeStamp.lastName}
                </div>
            </span>
        </span>
    );
};
