import { PlayersCheckIn } from "../../../../components/stopwatch/players-check-in";
import { reassignTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { useTimerDispatch } from "../../../../hooks";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { timeKeeperIdAtom } from "stopwatch-states";

const PlayersReassignTime = () => {
    const [timeKeeperId] = useAtom(timeKeeperIdAtom);
    const dispatch = useTimerDispatch();

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