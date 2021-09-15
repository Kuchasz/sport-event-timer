import Icon from "@mdi/react";
import { formatNumber } from "../utils";
import {
    mdiAccountSupervisor,
    mdiAlarmCheck,
    mdiAlarmOff,
    mdiWrench
    } from "@mdi/js";
import { Player, TimeStamp } from "@set/timer/model";
import { PrimaryActionButton } from "./action-button";
import { TimeStampDisplay } from "./time-stamp-display";

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
                <div key={p.number} className="py-5 flex">
                    <span className="text-3xl mr-4">{formatNumber(p.number, 3)}</span>
                    <span className="flex-grow">
                        <TimeStampDisplay timeStamp={p.timeStamp} />
                        <div className="opacity-50 text-sm">
                            {p.name} {p.lastName}
                        </div>
                    </span>
                    {p.timeStamp ? (
                        <PrimaryActionButton icon={mdiAlarmOff} onClick={onReset(p.timeStamp.id)} />
                    ) : (
                        <PrimaryActionButton icon={mdiAlarmCheck} onClick={onRecord(p.id)} />
                    )}
                    {p.timeStamp && (
                        <>
                            <span className="ml-1 bg-gray-600 flex items-center rounded-md px-2 py-1 self-center text-white">
                                <Icon path={mdiWrench} size={1} color="white" />
                            </span>
                            <span className="ml-1 bg-gray-600 flex items-center rounded-md px-2 py-1 self-center text-white">
                                <Icon path={mdiAccountSupervisor} size={1} color="white" />
                            </span>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};
