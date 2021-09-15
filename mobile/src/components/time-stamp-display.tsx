import { formatTime } from "../utils";
import { TimeStamp } from "@set/timer/model";

export const TimeStampDisplay = ({ timeStamp }: { timeStamp?: TimeStamp }) => (
    <div className="text-lg font-semibold ">
        <span>{timeStamp ? formatTime(new Date(timeStamp.time)) : "- - - - - - -"}</span>
    </div>
);
