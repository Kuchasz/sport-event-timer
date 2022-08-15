import { add } from "@set/timer/dist/slices/time-stamps";
import { getCurrentTime } from "@set/shared/dist";
import { useTimerDispatch } from "../../../hooks";
import { PlayersCheckIn } from "components/stopwatch/players-check-in";
import { timeKeeperIdAtom, timeOffsetAtom } from "stopwatch-states";
import { useAtom } from "jotai";

const PlayersDialPad = () => {
    const dispatch = useTimerDispatch();
    const [timeKeeperId] = useAtom(timeKeeperIdAtom);
    const [offset] = useAtom(timeOffsetAtom);

    return (
        <PlayersCheckIn
            onPlayerCheckIn={bibNumber => {
                dispatch(
                    add({
                        bibNumber,
                        timeKeeperId,
                        time: getCurrentTime(offset)
                    })
                );
            }}
            title={"Clock in player"}
            timeKeeperId={timeKeeperId}
        />
    );
};

export default PlayersDialPad;