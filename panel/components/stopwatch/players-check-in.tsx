import { DialPad } from "./dial-pad";
import { getAvailableDigits, getAvailableNumbers } from "@set/utils/dist/string";
import type { Player, TimeStamp } from "@set/timer/dist/model";
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
    <div className="font-regular flex h-16 justify-center py-2 text-center text-4xl text-orange-500">{playerNumber}</div>
);

type CheckInPlayerProps = {
    player: PlayerWithTimeStamp;
    onPlayerCheckIn: (bibNumber: number) => void;
};
export const CheckInPlayer = ({ player, onPlayerCheckIn }: CheckInPlayerProps) => (
    <button
        onPointerDown={() => onPlayerCheckIn(player.bibNumber)}
        className="mt-2 flex w-full items-center rounded-md bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 shadow-md">
        <div className="mr-4 text-2xl font-bold">{player.bibNumber}</div>
        <div>
            {player.name} {player.lastName}
        </div>
    </button>
);

type PlayersDialPadProps = {
    onPlayerCheckIn: (bibNumber: number) => void;
    timingPointId?: number;
};

export const PlayersCheckIn = ({ onPlayerCheckIn, timingPointId }: PlayersDialPadProps) => {
    const [playerNumber, setPlayerNumber] = useState("");

    const { raceId } = useParams<{ raceId: string }>()!;

    const { data: allPlayers } = trpc.player.stopwatchPlayers.useQuery({ raceId: parseInt(raceId) }, { initialData: [] });

    const allTimeStamps = useTimerSelector(x => x.timeStamps);
    const allAbsences = useTimerSelector(x => x.absences);

    const playersWithTimeStamps = allPlayers.map(x => ({
        ...x,
        timeStamp: allTimeStamps.find(a => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
        absent: allAbsences.find(a => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
    }));

    const nonAbsentPlayersWithoutTimeStamps = playersWithTimeStamps.filter(x => x.timeStamp === undefined && x.absent === undefined);
    const playersNumbersWithoutTimeStamps = nonAbsentPlayersWithoutTimeStamps.map(x => x.bibNumber);

    const availableNumbers = getAvailableNumbers(playerNumber, playersNumbersWithoutTimeStamps);
    const availablePlayers = nonAbsentPlayersWithoutTimeStamps.filter(p => availableNumbers.includes(p.bibNumber));

    return (
        <div className="flex h-full flex-col">
            <div className="mx-12 mt-2 flex h-2/5 flex-auto flex-col-reverse items-stretch overflow-y-auto text-white">
                {availablePlayers.map(p => (
                    <CheckInPlayer
                        key={p.bibNumber}
                        onPlayerCheckIn={bibNumber => {
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
