import Icon from "@mdi/react";
import {
    mdiAccountSupervisor,
    mdiAlarmCheck,
    mdiAlarmOff,
    mdiWrench
    } from "@mdi/js";
import { Player, TimeStamp } from "@set/timer/model";
import { PlayerWithTimeStampDisplay } from "./player-with-timestamp-display";
import { PrimaryActionButton } from "./action-button";

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
                        <>
                            <span className="ml-1 bg-gray-600 flex items-center rounded-md px-2 py-1 text-white">
                                <Icon path={mdiWrench} size={1} color="white" />
                            </span>
                            <span className="ml-1 bg-gray-600 flex items-center rounded-md px-2 py-1 text-white">
                                <Icon path={mdiAccountSupervisor} size={1} color="white" />
                            </span>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};
