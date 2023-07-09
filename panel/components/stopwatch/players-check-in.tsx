import { DialPad } from "./dial-pad";
import { getAvailableDigits, getAvailableNumbers } from "@set/utils/dist/string";
import { Player, TimeStamp } from "@set/timer/dist/model";
import { useState } from "react";
import { useTimerSelector } from "../../hooks";
import { useParams } from "next/navigation";
import { trpc } from "trpc-core";

type PlayerWithTimeStamp = Player & {
    timeStamp?: TimeStamp;
};

type TypedPlayerProps = {
    playerNumber: string;
};

export const TypedPlayer = ({ playerNumber }: TypedPlayerProps) => (
    <div className="text-orange-500 h-16 flex text-center justify-center text-4xl font-regular py-2">{playerNumber}</div>
);

type CheckInPlayerProps = {
    player: PlayerWithTimeStamp;
    onPlayerCheckIn: (bibNumber: number) => void;
};
export const CheckInPlayer = ({ player, onPlayerCheckIn }: CheckInPlayerProps) => (
    <button
        onClick={() => onPlayerCheckIn(player.bibNumber)}
        className="bg-gradient-to-r from-orange-500 to-red-500 mt-2 flex w-full px-4 py-2 items-center shadow-md rounded-md"
    >
        <div className="font-bold text-2xl mr-4">{player.bibNumber}</div>
        <div>
            {player.name} {player.lastName}
        </div>
    </button>
);

type PlayersDialPadProps = {
    onPlayerCheckIn: (bibNumber: number) => void;
    title?: string;
    timingPointId?: number;
};

export const PlayersCheckIn = ({ onPlayerCheckIn, title, timingPointId }: PlayersDialPadProps) => {
    const [playerNumber, setPlayerNumber] = useState("");

    const { raceId } = useParams() as { raceId: string };

    const { data: allPlayers } = trpc.player.stopwatchPlayers.useQuery({ raceId: parseInt(raceId as string) }, { initialData: [] });

    const allTimeStamps = useTimerSelector((x) => x.timeStamps);
    const allAbsences = useTimerSelector((x) => x.absences);

    const playersWithTimeStamps = allPlayers!.map((x) => ({
        ...x,
        timeStamp: allTimeStamps.find((a) => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
        absent: allAbsences.find(a => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
    }));

    const nonAbsentPlayersWithoutTimeStamps = playersWithTimeStamps.filter((x) => x.timeStamp === undefined && x.absent === undefined);
    const playersNumbersWithoutTimeStamps = nonAbsentPlayersWithoutTimeStamps.map((x) => x.bibNumber);

    const availableNumbers = getAvailableNumbers(playerNumber, playersNumbersWithoutTimeStamps);
    const availablePlayers = nonAbsentPlayersWithoutTimeStamps.filter((p) => availableNumbers.includes(p.bibNumber));

    return (
        <div className="flex h-full flex-col">
            {title && <h1 className="text-2xl text-center py-4">{title}</h1>}
            <div className="flex-auto text-white flex flex-col-reverse mx-12 overflow-y-auto mt-2 items-stretch h-3/5">
                {availablePlayers.map((p) => (
                    <CheckInPlayer
                        key={p.bibNumber}
                        onPlayerCheckIn={(bibNumber) => {
                            onPlayerCheckIn(bibNumber);
                            setPlayerNumber("");
                        }}
                        player={p}
                    />
                ))}
            </div>
            <TypedPlayer playerNumber={playerNumber} />
            <DialPad
                availableDigits={getAvailableDigits(playerNumber, playersNumbersWithoutTimeStamps)}
                number={playerNumber}
                onNumberChange={setPlayerNumber}
            />
        </div>
    );
};
