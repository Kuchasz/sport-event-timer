import { formatTime } from "@set/utils/dist/datetime";
import { formatNumber } from "@set/utils/dist/number";
import { Player, TimeStamp } from "@set/timer/dist/model";
import classNames from "classnames";
import { usePreviousValue } from "hooks";

type PlayerWithTimeStamp = Player & {
    timeStamp?: TimeStamp;
};

export const PlayerWithTimeStampDisplay = ({ padBibNumber, playerWithTimeStamp }: { padBibNumber: number, playerWithTimeStamp: Partial<PlayerWithTimeStamp> }) => {
    const previousTimeStamp = usePreviousValue(playerWithTimeStamp.timeStamp?.time);

    return (
        <span className="flex items-center grow h-12">
            {playerWithTimeStamp.bibNumber !== undefined ? (
                <span className="text-3xl mr-4">{formatNumber(playerWithTimeStamp.bibNumber, padBibNumber)}</span>
            ) : null}

            <span className="grow">
                <div
                    className={classNames("font-semibold transition-all overflow-hidden duration-300", {
                        ["max-h-0 opacity-0"]: playerWithTimeStamp.timeStamp == null,
                        ["max-h-8 opacity-100"]: playerWithTimeStamp.timeStamp,
                    })}
                >
                    <span>
                        {playerWithTimeStamp.timeStamp
                            ? formatTime(new Date(playerWithTimeStamp.timeStamp.time))
                            : previousTimeStamp
                            ? formatTime(new Date(previousTimeStamp))
                            : null}
                    </span>
                </div>
                <div className="opacity-50 text-sm">
                    <span className="text-ellipsis">{playerWithTimeStamp.name}</span> {playerWithTimeStamp.lastName}
                </div>
            </span>
        </span>
    );
};
