import { mdiClose, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { getAvailableDigits } from "@set/utils/dist/string";
import classNames from "classnames";
import fuzzysort from "fuzzysort";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { trpc } from "trpc-core";
import { useTimerSelector } from "../../hooks";
import { DialPad } from "./dial-pad";
import { sort } from "@set/utils/dist/array";

type TypedPlayerProps = {
    playerNumber: string;
    bestGuess?: string;
    onPlayerCheckIn: (bibNumber: string) => void;
    reset: () => void;
};

export const TypedPlayer = ({ onPlayerCheckIn, reset, playerNumber, bestGuess }: TypedPlayerProps) => (
    <div className="my-8 flex h-16 items-center px-12">
        <div
            className={classNames("opacity-80", { ["invisible"]: playerNumber !== bestGuess })}
            onClick={() => onPlayerCheckIn(playerNumber)}>
            <Icon size={0.8} path={mdiPlus}></Icon>
        </div>
        <div className="flex flex-grow justify-center text-center text-4xl">
            <div className="text-orange-500">{playerNumber}</div>
            <span className="text-gray-300">{bestGuess?.slice(playerNumber.length)}</span>
        </div>
        <div onClick={reset} className={classNames("opacity-60", { ["invisible"]: !bestGuess })}>
            <Icon size={0.8} path={mdiClose}></Icon>
        </div>
    </div>
);

type Result = { score: number; target: string };
type CheckInPlayer = { bibNumber: string; name: string; lastName: string };
interface CheckinResult extends ReadonlyArray<Result> {
    readonly score: number;
    readonly obj: CheckInPlayer;
}

type CheckInPlayerProps = {
    player: { bibNumber: string; name: string; lastName: string };
    typeahead: string;
    onPlayerCheckIn: (bibNumber: string) => void;
    result: CheckinResult;
};
export const CheckInPlayer = ({ result, typeahead, player, onPlayerCheckIn }: CheckInPlayerProps) => (
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
            {typeahead
                ? fuzzysort.highlight(result[0], (m, i) => (
                      <mark className="bg-transparent font-semibold text-orange-500" key={i}>
                          {m}
                      </mark>
                  ))
                : player.bibNumber}
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

    const t = useTranslations();

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

    const availablePlayers = sort(
        nonAbsentPlayersWithoutTimeStamps.map(a => ({ ...a, bibNumber: a.bibNumber.toString() })),
        p => parseInt(p.bibNumber),
    );

    const sortedAvailablePlayers = fuzzysort.go(playerNumber, availablePlayers, { all: true, keys: ["bibNumber"] });

    return (
        <div className="flex h-full flex-col">
            <TypedPlayer
                onPlayerCheckIn={bibNumber => {
                    onPlayerCheckIn(bibNumber);
                    setPlayerNumber("");
                }}
                reset={() => setPlayerNumber("")}
                playerNumber={playerNumber}
                bestGuess={sortedAvailablePlayers[0]?.obj?.bibNumber?.toString()}
            />
            {!!sortedAvailablePlayers?.length && (
                <div className="text-2xs flex w-full justify-between px-12 font-semibold text-gray-400">
                    <div className="uppercase">{t("stopwatch.checkIn.suggestion.player")}</div>
                    <div>{t("stopwatch.checkIn.suggestion.bibNumber")}</div>
                </div>
            )}
            <div className="mx-12 mt-2 flex h-2/5 flex-auto flex-col items-stretch overflow-y-auto text-white">
                {sortedAvailablePlayers.map(p => (
                    <CheckInPlayer
                        key={p.obj.bibNumber}
                        onPlayerCheckIn={bibNumber => {
                            setPlayerNumber(bibNumber);
                        }}
                        result={p}
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
