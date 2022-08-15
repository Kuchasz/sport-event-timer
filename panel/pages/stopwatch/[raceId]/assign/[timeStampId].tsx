import { assignTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { timeKeeperIdAtom } from "stopwatch-states";
import { PlayersCheckIn } from "../../../../components/stopwatch/players-check-in";
import { useTimerDispatch } from "../../../../hooks";

const PlayersAssignTime = () => {
    const [timeKeeperId] = useAtom(timeKeeperIdAtom);
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
            timeKeeperId={timeKeeperId}
        />
    );
};

export default PlayersAssignTime;
