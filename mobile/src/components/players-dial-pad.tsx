import { DialPad } from "./dial-pad";
import { getAvailableDigits, getAvailableNumbers } from "../utils";
import { Player, TimeStamp } from "@set/timer/model";
import { useAppSelector } from "../hooks";
import { useState } from "react";

type PlayerWithTimeStamp = Player & {
    timeStamp?: TimeStamp;
};

type TypedPlayerProps = {
    playerNumber: string;
};
export const TypedPlayer = ({ playerNumber }: TypedPlayerProps) => (
    <div className="text-gray-600 border-gray-600 flex justify-center text-2xl font-regular py-4">
        {playerNumber}&nbsp;
    </div>
);

type CheckInPlayerProps = {
    player: PlayerWithTimeStamp;
    onPlayerCheckIn: (playerId: number) => void;
};
export const CheckInPlayer = ({ player, onPlayerCheckIn }: CheckInPlayerProps) => (
    <button
        onClick={() => onPlayerCheckIn(player.id)}
        className="bg-orange-500 flex mb-2 w-full px-4 py-2 items-center shadow-md rounded-md"
    >
        <div className="font-bold text-2xl mr-4">{player.number}</div>
        <div>
            {player.name} {player.lastName}
        </div>
    </button>
);

type PlayersDialPadProps = {
    onPlayerCheckIn: (playerId: number) => void;
};

export const PlayersDialPad = ({ onPlayerCheckIn }: PlayersDialPadProps) => {
    const [playerNumber, setPlayerNumber] = useState("");
    const allPlayers = useAppSelector((x) => x.players);
    const allTimeStamps = useAppSelector((x) => x.timeStamps);

    const playersWithTimeStamps = allPlayers.map((x) => ({
        ...x,
        timeStamp: allTimeStamps.find((a) => a.playerId === x.id)
    }));

    const playersWithoutTimeStamps = playersWithTimeStamps.filter((x) => x.timeStamp === undefined);
    const playersNumbersWithoutTimeStamps = playersWithoutTimeStamps.map((x) => x.number);

    const availableNumbers = getAvailableNumbers(playerNumber, playersNumbersWithoutTimeStamps);
    const availablePlayers = playersWithoutTimeStamps.filter((p) => availableNumbers.includes(p.number));

    return (
        <div className="flex h-full flex-col">
            <TypedPlayer playerNumber={playerNumber} />
            <div className="flex-auto flex mx-12 flex-col flex-wrap items-stretch overflow-hidden h-2/5">
                {availablePlayers.map((p) => (
                    <CheckInPlayer
                        key={p.id}
                        onPlayerCheckIn={(playerId) => {
                            onPlayerCheckIn(playerId);
                            setPlayerNumber("");
                        }}
                        player={p}
                    />
                ))}
            </div>
            <DialPad
                availableDigits={getAvailableDigits(playerNumber, playersNumbersWithoutTimeStamps)}
                number={playerNumber}
                onNumberChange={setPlayerNumber}
            />
        </div>
    );
};
