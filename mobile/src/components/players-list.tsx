import { ActionButton, PrimaryActionButton } from "./action-button";
import { mdiAlarmCheck, mdiAlarmOff, mdiWrench } from "@mdi/js";
import { Player, TimeStamp } from "@set/timer/model";
import { PlayerWithTimeStampDisplay } from "./player-with-timestamp-display";
import { useNavigate } from "react-router";

type PlayerWithTimeStamp = Player & {
    timeStamp?: TimeStamp;
};

type PlayersListProps = {
    players: PlayerWithTimeStamp[];
    onTimeRecord: (playerId: number) => void;
    onTimeReset: (timeStampId: number) => void;
};

export const PlayersList = ({ players, onTimeRecord, onTimeReset }: PlayersListProps) => {
    const onReset = (id: number) => () => onTimeReset(id);
    const onRecord = (id: number) => () => onTimeRecord(id);
    const navigate = useNavigate();
    return (
        <div className="px-4 text-white">
            {players.map((p) => (
                <div key={p.number} className="py-5 flex items-center">
                    <PlayerWithTimeStampDisplay playerWithTimeStamp={p} />
                    {p.timeStamp ? (
                        <PrimaryActionButton icon={mdiAlarmOff} onClick={onReset(p.timeStamp.id)} />
                    ) : (
                        <PrimaryActionButton icon={mdiAlarmCheck} onClick={onRecord(p.id)} />
                    )}
                    {p.timeStamp && (
                        <ActionButton
                            icon={mdiWrench}
                            onClick={() => {
                                navigate(`${process.env.PUBLIC_URL}/tweak/${p.timeStamp?.id}`);
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};
