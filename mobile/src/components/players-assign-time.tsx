import { PlayersCheckIn } from "./players-check-in";
import { update } from "@set/timer/slices/time-stamps";
import { useNavigate } from "react-router-dom";
import { useTimerDispatch } from "../hooks";

type PlayersAssignTimeProps = {
    timeStampToAssign: number;
    timeKeeperId: number;
};

export const PlayersAssignTime = ({ timeKeeperId, timeStampToAssign }: PlayersAssignTimeProps) => {
    const dispatch = useTimerDispatch();
    const navigate = useNavigate();

    return (
        <PlayersCheckIn
            onPlayerCheckIn={(playerId) => {
                dispatch(update({ playerId, id: timeStampToAssign }));
                navigate(-1);
            }}
            title="Assign time to player"
            timeKeeperId={timeKeeperId}
        />
    );
};
