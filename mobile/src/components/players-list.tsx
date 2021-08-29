import { Player } from "../player";

type PlayersListProps = {
    players: Player[];
    measurementPoint: string;
};

export const PlayersList = ({ players, measurementPoint }: PlayersListProps) => (
    <div className="text-black">
        {players.map((p) => (
            <div className="py-5 flex ">
                <span className="font-semibold pr-4">{p.number}</span>
                <span className="flex-grow">{p.name}</span>
                <span className="bg-gray-600 rounded-md px-8 py-3 text-white">
                    <span className="font-semibold pr-4">{p.number}</span> {measurementPoint}
                </span>
            </div>
        ))}
    </div>
);
