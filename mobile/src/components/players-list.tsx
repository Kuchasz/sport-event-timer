import Icon from "@mdi/react";
import { formatNumber, formatTime } from "../utils";
import {
    mdiAccountSupervisor,
    mdiAlarmCheck,
    mdiAlarmOff,
    mdiWrench
    } from "@mdi/js";
import { Player, TimeStamp } from "@set/timer/model";

type PlayerWithTimeStamp = Player & {
    timeStamp?: TimeStamp;
};

type PlayersListProps = {
    players: PlayerWithTimeStamp[];
    timeKeeperName: string;
    onTimeRecord: (playerId: number) => void;
    onTimeReset: (timeStampId: number) => void;
};

type PlayerTimeStampProps = {
    time: number;
    onReset: () => void;
};

const PlayerTimeStamp = ({ time, onReset }: PlayerTimeStampProps) => (
    <button onClick={onReset}>
        <Icon path={mdiAlarmOff} size={1} color="white" />
    </button>
);

type RecordTimeStampProps = {
    timeKeeperName: string;
    onRecord: () => void;
};
const RecordTimeStamp = ({ timeKeeperName, onRecord }: RecordTimeStampProps) => (
    <button onClick={onRecord}>
        <Icon path={mdiAlarmCheck} size={1} color="white" />
    </button>
);

export const PlayersList = ({ players, timeKeeperName, onTimeRecord, onTimeReset }: PlayersListProps) => {
    const onReset = (id: number) => () => onTimeReset(id);
    const onRecord = (id: number) => () => onTimeRecord(id);
    return (
        <div className="px-4 text-white">
            {players.map((p) => (
                <div key={p.number} className="py-5 flex">
                    <span className="text-3xl mr-4">{formatNumber(p.number, 3)}</span>
                    <span className="flex-grow">
                        <div className="text-lg font-semibold ">
                            <span>{p.timeStamp ? formatTime(new Date(p.timeStamp.time)) : "- - - - - - -"}</span>
                        </div>
                        <div className="opacity-50 text-sm">
                            {p.name} {p.lastName}
                        </div>
                    </span>
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 flex items-center rounded-md px-2 py-1 self-center text-white">
                        {p.timeStamp ? (
                            <PlayerTimeStamp time={p.timeStamp.time} onReset={onReset(p.timeStamp.id)} />
                        ) : (
                            <RecordTimeStamp timeKeeperName={timeKeeperName} onRecord={onRecord(p.id)} />
                        )}
                    </span>
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
