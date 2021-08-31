import { formatTime } from "../utils";
type PlayerWithTimeStamp = {
    id: number;
    number: number;
    name: string;
    timeStamp?: {
        id: number;
        time: number;
    };
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
    <span>
        <span className="font-semibold pr-4">{time && formatTime(new Date(time))}</span>
        <button onClick={onReset}>↺</button>
    </span>
);

type RecordTimeStampProps = {
    timeKeeperName: string;
    onRecord: () => void;
};
const RecordTimeStamp = ({ timeKeeperName, onRecord }: RecordTimeStampProps) => (
    <span>
        <button onClick={onRecord}>{timeKeeperName}</button>
    </span>
);

export const PlayersList = ({ players, timeKeeperName, onTimeRecord, onTimeReset }: PlayersListProps) => {
    const onReset = (id: number) => () => onTimeReset(id);
    const onRecord = (id: number) => () => onTimeRecord(id);
    return (
        <div className="text-black">
            {players.map((p) => (
                <div key={p.number} className="py-5 flex ">
                    <span className="font-semibold pr-4">{p.number}</span>
                    <span className="flex-grow">{p.name}</span>
                    <span className="bg-gray-600 rounded-md px-8 py-3 text-white">
                        {p.timeStamp ? (
                            <PlayerTimeStamp time={p.timeStamp.time} onReset={onReset(p.timeStamp.id)} />
                        ) : (
                            <RecordTimeStamp timeKeeperName={timeKeeperName} onRecord={onRecord(p.id)} />
                        )}
                    </span>
                </div>
            ))}
        </div>
    );
};
