import { PlayersCheckIn } from "./players-check-in";
import { reassignTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { useNavigate, useParams } from "react-router-dom";
import { useTimerDispatch } from "../hooks";

type PlayersReassignTimeProps = {
    timeKeeperId: number;
};

export const PlayersReassignTime = ({ timeKeeperId }: PlayersReassignTimeProps) => {
    const dispatch = useTimerDispatch();
    const navigate = useNavigate();
    const { timeStampToAssignId } = useParams();

    return (
        <PlayersCheckIn
            onPlayerCheckIn={playerId => {
                dispatch(reassignTimeStamp({ playerId, id: parseInt(timeStampToAssignId!) }));
                navigate(-1);
            }}
            title="Reassign time to player"
            timeKeeperId={timeKeeperId}
        />
    );
};
