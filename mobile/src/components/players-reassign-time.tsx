import { PlayersCheckIn } from "./players-check-in";
import { update } from "@set/timer/slices/time-stamps";
import { useNavigate } from "react-router-dom";
import { useTimerDispatch } from "../hooks";

type PlayersReassignTimeProps = {
    timeStampToAssign: number;
    timeKeeperId: number;
};

export const PlayersReassignTime = ({ timeKeeperId, timeStampToAssign }: PlayersReassignTimeProps) => {
    const dispatch = useTimerDispatch();
    const navigate = useNavigate();

    return (
        <PlayersCheckIn
            onPlayerCheckIn={(playerId) => {
                dispatch(update({ playerId, id: timeStampToAssign }));
                navigate(-1);
            }}
            title="Reassign time to player"
            timeKeeperId={timeKeeperId}
        />
    );
};
