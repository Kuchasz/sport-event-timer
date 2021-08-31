import { Player } from "@set/timer/model";

type PlayerWithTimeStamp = Player & {
    timeStamp?: {
        id: number;
        time: number;
    };
};

type CheckInPlayerProps = {
    playerNumber: string;
    player?: PlayerWithTimeStamp;
    onPlayerCheckIn: (playerId: number) => void;
};
export const CheckInPlayer = ({ playerNumber, player, onPlayerCheckIn }: CheckInPlayerProps) =>
    player ? (
        <button
            onClick={() => onPlayerCheckIn(player.id)}
            disabled={player.timeStamp !== undefined}
            className="disabled:bg-gray-500 bg-orange-500 flex flex-col items-center rounded-md m-8 h-16 py-1"
        >
            <div className="text-2xl font-bold">{playerNumber}</div>
            <div>
                {player.name} {player.lastName}
            </div>
        </button>
    ) : (
        <span className="border-2 border-dashed text-gray-600 border-gray-600 flex justify-center rounded-md m-8 text-2xl h-16 font-bold py-4">
            {playerNumber}
        </span>
    );
