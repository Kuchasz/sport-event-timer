import { formatNumber, formatTime } from "../utils";
import { Player, TimeStamp } from "@set/timer/model";

type PlayerWithTimeStamp = Player & {
    timeStamp?: TimeStamp;
};

export const PlayerWithTimeStampDisplay = ({
    playerWithTimeStamp
}: {
    playerWithTimeStamp: Partial<PlayerWithTimeStamp>;
}) => (
    <span className="flex flex-grow h-12">
        <span className="text-3xl mr-4">
            {playerWithTimeStamp.number ? formatNumber(playerWithTimeStamp.number, 3) : "- - -"}
        </span>
        <span className="flex-grow">
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
