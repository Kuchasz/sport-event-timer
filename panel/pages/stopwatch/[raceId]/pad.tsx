import { add } from "@set/timer/dist/slices/time-stamps";
import { getCurrentTime } from "@set/utils/dist/datetime";
import { useTimerDispatch } from "../../../hooks";
import { PlayersCheckIn } from "components/stopwatch/players-check-in";
import { timingPointIdAtom, timeOffsetAtom } from "stopwatch-states";
import { useAtom } from "jotai";

const PlayersDialPad = () => {
    const dispatch = useTimerDispatch();
    const [timingPointId] = useAtom(timingPointIdAtom);
    const [offset] = useAtom(timeOffsetAtom);

    return (
        <PlayersCheckIn
            onPlayerCheckIn={bibNumber => {
                dispatch(
                    add({
                        bibNumber,
                        timingPointId,
                        time: getCurrentTime(offset)
                    })
                );
            }}
            timingPointId={timingPointId}
        />
    );
};

export default PlayersDialPad;