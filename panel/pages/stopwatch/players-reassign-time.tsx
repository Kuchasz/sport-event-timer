import { PlayersCheckIn } from "../../components/stopwatch/players-check-in";
import { reassignTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { useNavigate, useParams } from "react-router-dom";
import { useTimerDispatch } from "../../hooks";

type PlayersReassignTimeProps = {
    timeKeeperId: number;
};

export const PlayersReassignTime = ({ timeKeeperId }: PlayersReassignTimeProps) => {
    const dispatch = useTimerDispatch();
    const navigate = useNavigate();
    const { timeStampToAssignId } = useParams();

    return (
        <PlayersCheckIn
            onPlayerCheckIn={bibNumber => {
                dispatch(reassignTimeStamp({ bibNumber, id: parseInt(timeStampToAssignId!) }));
                navigate(-1);
            }}
            title="Reassign time to player"
            timeKeeperId={timeKeeperId}
        />
    );
};
