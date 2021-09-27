import { assignPlayer } from "@set/timer/slices/time-stamps";
import { PlayersCheckIn } from "./players-check-in";
import { useHistory } from "react-router-dom";
import { useTimerDispatch } from "../hooks";

type PlayersReassignTimeProps = {
    timeStampToAssign: number;
    timeKeeperId: number;
};

export const PlayersReassignTime = ({ timeKeeperId, timeStampToAssign }: PlayersReassignTimeProps) => {
    const dispatch = useTimerDispatch();
    const history = useHistory();

    return (
        <PlayersCheckIn
            onPlayerCheckIn={(playerId) => {
                dispatch(assignPlayer({ playerId, id: timeStampToAssign }));
                history.goBack();
            }}
            title="Reassign time to player"
            timeKeeperId={timeKeeperId}
        />
    );
};
