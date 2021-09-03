import { CheckInPlayer } from "./check-in-player";
import { DialPad } from "./dial-pad";
import { getAvailableDigits } from "../utils";
import { useAppSelector } from "../hooks";
import { useState } from "react";

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
    const playersNumbersWithoutTimeStamps = playersWithoutTimeStamps.map((x) => x.number.toString());

    return (
        <div className="flex h-full flex-col">
            <CheckInPlayer
                onPlayerCheckIn={(playerId) => {
                    onPlayerCheckIn(playerId);
                    setPlayerNumber("");
                }}
                playerNumber={playerNumber}
                player={playersWithoutTimeStamps.find((p) => p.number === parseInt(playerNumber))}
            />
            {/* <div className="flex-auto h-2/5 bg-red-900"></div> */}
            <DialPad
                availableDigits={getAvailableDigits(playerNumber, playersNumbersWithoutTimeStamps)}
                number={playerNumber}
                onNumberChange={setPlayerNumber}
            />
        </div>
    );
};
