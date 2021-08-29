import { formatTime } from "../utils";
type PlayerWithTime = {
    id: number;
    number: number;
    name: string;
    time?: number;
};

type PlayersListProps = {
    players: PlayerWithTime[];
    timeKeeperName: string;
    onPlayerClick: (playerId: number) => void;
};

export const PlayersList = ({ players, timeKeeperName, onPlayerClick }: PlayersListProps) => (
    <div className="text-black">
        {players.map(p => (
            <div onClick={() => onPlayerClick(p.id)} key={p.number} className="py-5 flex ">
                <span className="font-semibold pr-4">{p.number}</span>
                <span className="flex-grow">{p.name}</span>
                <span className="bg-gray-600 rounded-md px-8 py-3 text-white">
                    <span className="font-semibold pr-4">{p.time && formatTime(new Date(p.time))}</span>{" "}
                    {timeKeeperName}
                </span>
            </div>
        ))}
    </div>
);
