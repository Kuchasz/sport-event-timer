import { add } from "@set/timer/dist/slices/time-stamps";
import { getCurrentTime } from "../utils";
import { PlayersCheckIn } from "./players-check-in";
import { useTimerDispatch } from "../hooks";

type PlayersDialPadProps = {
    timeKeeperId: number;
    offset: number;
};

export const PlayersDialPad = ({ timeKeeperId, offset }: PlayersDialPadProps) => {
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
