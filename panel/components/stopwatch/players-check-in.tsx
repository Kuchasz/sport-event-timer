import { DialPad } from "./dial-pad";
import { getAvailableDigits, getAvailableNumbers } from "@set/utils/dist/string";
import type { Player, TimeStamp } from "@set/timer/dist/model";
import { useState } from "react";
import { useTimerSelector } from "../../hooks";
import { useParams } from "next/navigation";
import { trpc } from "trpc-core";
import { mdiClose, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";

type PlayerWithTimeStamp = Player & {
    timeStamp?: TimeStamp;
};

type TypedPlayerProps = {
    playerNumber: string;
    bestGuess?: string;
};

export const TypedPlayer = ({ playerNumber, bestGuess }: TypedPlayerProps) => (
    <div className="flex h-16 items-center px-8 py-2">
        <Icon size={1} path={mdiPlus}></Icon>
        <div className="flex flex-grow justify-center text-center text-4xl font-semibold">
            <div className="text-orange-500">{playerNumber}</div>
            <span className="text-gray-300">{bestGuess?.slice(playerNumber.length)}</span>
        </div>
        <Icon className="opacity-60" size={0.8} path={mdiClose}></Icon>
    </div>
);

type CheckInPlayerProps = {
    player: PlayerWithTimeStamp;
    typeahead: string;
    onPlayerCheckIn: (bibNumber: number) => void;
};
export const CheckInPlayer = ({ typeahead, player, onPlayerCheckIn }: CheckInPlayerProps) => (
    <button
        onClick={() => onPlayerCheckIn(player.bibNumber)}
        className="flex w-full select-none items-center rounded-md py-1 text-sm text-gray-400">
        <div className={classNames("text-gray-500", { ["font-semibold text-orange-500"]: typeahead === player.bibNumber.toString() })}>
            {player.name} {player.lastName}
        </div>
        <div className="flex-grow"></div>
        <div className="font-mono font-semibold">
            <span className="text-orange-500">{typeahead}</span>
            {player.bibNumber.toString().slice(typeahead.length)}
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
            <TypedPlayer playerNumber={playerNumber} bestGuess={availablePlayers[0]?.bibNumber?.toString()} />
            <div className="mx-12 mt-2 flex h-2/5 flex-auto flex-col items-stretch overflow-y-auto text-white">
                {availablePlayers.map(p => (
                    <CheckInPlayer
                        key={p.bibNumber}
                        onPlayerCheckIn={bibNumber => {
                            onPlayerCheckIn(bibNumber);
                            setPlayerNumber("");
                        }}
                        typeahead={playerNumber}
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
