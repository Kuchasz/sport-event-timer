import { formatNumber, formatTime } from "@set/shared/dist/utils";
import { Player, TimeStamp } from "@set/timer/dist/model";
import classNames from "classnames";

type PlayerWithTimeStamp = Player & {
    timeStamp?: TimeStamp;
};

export const PlayerWithTimeStampDisplay = ({ playerWithTimeStamp }: { playerWithTimeStamp: Partial<PlayerWithTimeStamp> }) => (
    <span className="flex items-center grow h-12">
        {playerWithTimeStamp.bibNumber !== undefined ? (
            <span className="text-3xl mr-4">{formatNumber(playerWithTimeStamp.bibNumber, 3)}</span>
        ) : null}

        <span className="grow">
            <div
                className={classNames("font-semibold transition-opacity", {
                    ["opacity-0"]: playerWithTimeStamp.timeStamp == null,
                    ["opacity-100"]: playerWithTimeStamp.timeStamp,
                })}
            >
                <span>{playerWithTimeStamp.timeStamp ? formatTime(new Date(playerWithTimeStamp.timeStamp.time)) : null}</span>
            </div>
            <div className="opacity-50 text-sm">
                <span className="text-ellipsis">{playerWithTimeStamp.name}</span> {playerWithTimeStamp.lastName}
            </div>
        </span>
    </span>
);
