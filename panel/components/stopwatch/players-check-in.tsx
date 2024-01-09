import { mdiClose, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { getAvailableDigits, getAvailableNumbers } from "@set/utils/dist/string";
import classNames from "classnames";
import fuzzysort from "fuzzysort";
import { useParams } from "next/navigation";
import { useState } from "react";
import { trpc } from "trpc-core";
import { useTimerSelector } from "../../hooks";
import { DialPad } from "./dial-pad";

type TypedPlayerProps = {
    playerNumber: string;
    bestGuess?: string;
};

export const TypedPlayer = ({ playerNumber, bestGuess }: TypedPlayerProps) => (
    <div className="flex h-16 items-center px-8 py-2">
        <Icon className={classNames({ ["invisible"]: playerNumber !== bestGuess })} size={1} path={mdiPlus}></Icon>
        <div className="flex flex-grow justify-center text-center text-4xl">
            <div className="text-orange-500">{playerNumber}</div>
            <span className="text-gray-300">{bestGuess?.slice(playerNumber.length)}</span>
        </div>
        <Icon className={classNames("opacity-60", { ["invisible"]: !bestGuess })} size={0.8} path={mdiClose}></Icon>
    </div>
);

type CheckInPlayerProps = {
    player: { bibNumber: string; name: string; lastName: string };
    typeahead: string;
    onPlayerCheckIn: (bibNumber: string) => void;
};
export const CheckInPlayer = ({ typeahead, player, onPlayerCheckIn }: CheckInPlayerProps) => (
    <button
        onClick={() => onPlayerCheckIn(player.bibNumber)}
        className={classNames("flex w-full select-none items-center rounded-md py-1 text-sm text-gray-400", {
            ["font-semibold text-orange-500"]: typeahead === player.bibNumber,
        })}>
        <div>
            {player.name} {player.lastName}
        </div>
        <div className="flex-grow"></div>
        <div className="">
            <span className="text-orange-500">{typeahead}</span>
            {player.bibNumber.slice(typeahead.length)}
        </div>
    </button>
);

type PlayersDialPadProps = {
    onPlayerCheckIn: (bibNumber: string) => void;
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
    const availablePlayers = nonAbsentPlayersWithoutTimeStamps
        .filter(p => availableNumbers.includes(p.bibNumber))
        .map(a => ({ ...a, bibNumber: a.bibNumber.toString() }));

    const sortedAvailablePlayers = fuzzysort.go(playerNumber, availablePlayers, { all: true, keys: ["bibNumber"] });

    return (
        <div className="flex h-full flex-col">
            <TypedPlayer playerNumber={playerNumber} bestGuess={availablePlayers[0]?.bibNumber?.toString()} />
            <div className="text-2xs flex w-full justify-between px-12 font-semibold text-gray-400">
                <div className="uppercase">Player</div>
                <div>Bib number</div>
            </div>
            <div className="mx-12 mt-2 flex h-2/5 flex-auto flex-col items-stretch overflow-y-auto text-white">
                {sortedAvailablePlayers.map(p => (
                    <CheckInPlayer
                        key={p.obj.bibNumber}
                        onPlayerCheckIn={bibNumber => {
                            onPlayerCheckIn(bibNumber);
                            setPlayerNumber("");
                        }}
                        typeahead={playerNumber}
                        player={p.obj}
                    />
                ))}
            </div>
            <div className="flex flex-col items-center bg-white">
                <DialPad
                    availableDigits={getAvailableDigits(playerNumber, playersNumbersWithoutTimeStamps)}
                    number={playerNumber}
                    onNumberChange={setPlayerNumber}
                />
            </div>
        </div>
    );
};
