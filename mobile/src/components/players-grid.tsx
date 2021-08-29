import { Player } from "../player";

type PlayersGridProps = {
    players: Player[];
};

export const PlayersGrid = ({ players }: PlayersGridProps) => (
    <div className="flex flex-wrap">
        {players.map((p) => (
            <div className="bg-gray-700 font-semibold text-2xl rounded-md px-8 py-2 m-2">{p.number}</div>
        ))}
    </div>
);
