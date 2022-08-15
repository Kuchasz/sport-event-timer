import { add } from "@set/timer/dist/slices/time-stamps";
import { getCurrentTime } from "@set/shared/dist";
import { useTimerDispatch } from "../../../hooks";
import { PlayersCheckIn } from "components/stopwatch/players-check-in";

type PlayersDialPadProps = {
    timeKeeperId: number;
    offset: number;
};

const PlayersDialPad = ({ timeKeeperId, offset }: PlayersDialPadProps) => {
    const dispatch = useTimerDispatch();

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