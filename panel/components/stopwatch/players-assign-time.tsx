import { assignTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { PlayersCheckIn } from "./players-check-in";
import { useNavigate, useParams } from "react-router-dom";
import { useTimerDispatch } from "../../hooks";

type PlayersAssignTimeProps = {
    timeKeeperId: number;
};

export const PlayersAssignTime = ({ timeKeeperId }: PlayersAssignTimeProps) => {
    const dispatch = useTimerDispatch();
    const navigate = useNavigate();
    const { timeStampToAssignId } = useParams();

    return (
        <PlayersCheckIn
            onPlayerCheckIn={bibNumber => {
                dispatch(assignTimeStamp({ bibNumber, id: parseInt(timeStampToAssignId!) }));
                navigate(-1);
            }}
            title="Assign time to player"
            timeKeeperId={timeKeeperId}
        />
    );
};
