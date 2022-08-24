import { assignTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { timingPointIdAtom } from "stopwatch-states";
import { PlayersCheckIn } from "../../../../components/stopwatch/players-check-in";
import { useTimerDispatch } from "../../../../hooks";

const PlayersAssignTime = () => {
    const [timingPointId] = useAtom(timingPointIdAtom);
    const dispatch = useTimerDispatch();
    
    const {
        query: { timeStampId },
        back,
    } = useRouter();

    return (
        <PlayersCheckIn
            onPlayerCheckIn={(bibNumber) => {
                dispatch(assignTimeStamp({ bibNumber, id: parseInt(timeStampId! as string) }));
                back();
            }}
            title="Assign time to player"
            timingPointId={timingPointId}
        />
    );
};

export default PlayersAssignTime;
