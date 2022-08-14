import { assignTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { useRouter } from "next/router";
import { PlayersCheckIn } from "../../../components/stopwatch/players-check-in";
import { useTimerDispatch, useTimerSelector } from "../../../hooks";

const PlayersAssignTime = () => {
    const timeKeeperId = useTimerSelector((x) => x.userConfig?.timeKeeperId);
    const dispatch = useTimerDispatch();
    const { query: {timeStampId}, back } = useRouter();

    return (
        <PlayersCheckIn
            onPlayerCheckIn={bibNumber => {
                dispatch(assignTimeStamp({ bibNumber, id: parseInt(timeStampId! as string) }));
                back();
            }}
            title="Assign time to player"
            timeKeeperId={timeKeeperId}
        />
    );
};

export default PlayersAssignTime;