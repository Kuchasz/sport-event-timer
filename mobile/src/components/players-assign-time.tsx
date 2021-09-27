import { assignPlayer } from "@set/timer/slices/time-stamps";
import { PlayersCheckIn } from "./players-check-in";
import { useHistory } from "react-router-dom";
import { useTimerDispatch } from "../hooks";

type PlayersAssignTimeProps = {
    timeStampToAssign: number;
    timeKeeperId: number;
};

export const PlayersAssignTime = ({ timeKeeperId, timeStampToAssign }: PlayersAssignTimeProps) => {
    const dispatch = useTimerDispatch();
    const history = useHistory();

    return (
        <PlayersCheckIn
            onPlayerCheckIn={(playerId) => {
                dispatch(assignPlayer({ playerId, id: timeStampToAssign }));
                history.goBack();
            }}
            title="Assign time to player"
            timeKeeperId={timeKeeperId}
        />
    );
};
