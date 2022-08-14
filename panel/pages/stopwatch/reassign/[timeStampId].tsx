import { PlayersCheckIn } from "../../../components/stopwatch/players-check-in";
import { reassignTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { useTimerDispatch, useTimerSelector } from "../../../hooks";
import { useRouter } from "next/router";

const PlayersReassignTime = () => {
    const dispatch = useTimerDispatch();

    const timeKeeperId = useTimerSelector((x) => x.userConfig?.timeKeeperId);

    const {
        query: { timeStampId },
        back,
    } = useRouter();

    return (
        <PlayersCheckIn
            onPlayerCheckIn={(bibNumber) => {
                dispatch(reassignTimeStamp({ bibNumber, id: parseInt(timeStampId! as string) }));
                back();
            }}
            title="Reassign time to player"
            timeKeeperId={timeKeeperId}
        />
    );
};

export default PlayersReassignTime;