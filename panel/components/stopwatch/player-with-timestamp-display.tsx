import { formatNumber, formatTime } from "@set/shared/dist/utils";
import { Player, TimeStamp } from "@set/timer/dist/model";

type PlayerWithTimeStamp = Player & {
    timeStamp?: TimeStamp;
};

export const PlayerWithTimeStampDisplay = ({
    playerWithTimeStamp
}: {
    playerWithTimeStamp: Partial<PlayerWithTimeStamp>;
}) => (
    <span className="flex items-center grow h-12">
        <span className="text-3xl mr-4">
            {playerWithTimeStamp.bibNumber !== undefined ? formatNumber(playerWithTimeStamp.bibNumber, 3) : "- - -"}
        </span>
        <span className="grow">
            <div className="text-lg font-semibold ">
                <span>
                    {playerWithTimeStamp.timeStamp
                        ? formatTime(new Date(playerWithTimeStamp.timeStamp.time))
                        : "- - - - - - -"}
                </span>
            </div>
            <div className="opacity-50 text-sm">
                {playerWithTimeStamp.name} {playerWithTimeStamp.lastName}
            </div>
        </span>
    </span>
);
