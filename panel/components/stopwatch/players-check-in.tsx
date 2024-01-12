import { Transition } from "@headlessui/react";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { createRange, sort } from "@set/utils/dist/array";
import { getAvailableDigits } from "@set/utils/dist/string";
import classNames from "classnames";
import fuzzysort from "fuzzysort";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { trpc } from "trpc-core";
import { useTimerSelector } from "../../hooks";
import { DialPad } from "./dial-pad";

type TypedPlayerProps = {
    playerNumber: string;
    bestGuess?: string;
    reset: () => void;
};

const typedNumberDigits = createRange({ from: 0, to: 9 });

const storedDigits: Record<number, string> = {};
const getDigitForIndex = (idx: number, value: string) => {
    if (value !== undefined) {
        storedDigits[idx] = value;
    }

    return storedDigits[idx];
};

export const TypedPlayer = ({ reset, playerNumber }: TypedPlayerProps) => {
    const playerNumberDigits = [...playerNumber];
    const t = useTranslations();
    return (
        <div className="flex flex-col items-center px-12">
            <div className="my-4 flex w-full items-center justify-between">
                <div className="invisible">
                    <Icon size={0.8} path={mdiClose}></Icon>
                </div>
                <div className="relative flex h-[2.5rem] flex-grow items-center justify-center text-center text-4xl">
                    {typedNumberDigits.map(d => (
                        <Transition
                            enter="transition-all ease-out duration-250 origin-bottom-left"
                            enterFrom="w-[0px] opacity-y-0 scale-0"
                            enterTo="w-[1.5rem] opacity-100 scale-y-1"
                            leave="transition-all ease-out duration-250 origin-bottom-left"
                            leaveTo="w-[0px] opacity-y-0 scale-0"
                            leaveFrom="w-[1.5rem] opacity-100 scale-y-1"
                            show={playerNumberDigits[d] !== undefined}
                            key={d}>
                            <div className="text-orange-500">{getDigitForIndex(d, playerNumberDigits[d])}</div>
                        </Transition>
                    ))}
                    <div
                        className={classNames("absolute flex items-center text-sm text-gray-300 opacity-0 transition-opacity", {
                            ["opacity-100"]: !playerNumber,
                        })}>
                        <span>{t("stopwatch.checkIn.typeBibNumber")}</span>
                    </div>
                </div>
                <div className={classNames("opacity-0 transition-opacity", { ["opacity-60"]: !!playerNumber })} onClick={reset}>
                    <Icon size={0.8} path={mdiClose}></Icon>
                </div>
            </div>
        </div>
    );
};

type Result = { score: number; target: string };
type CheckInPlayer = { bibNumber: string; name: string; lastName: string };
interface CheckinResult extends ReadonlyArray<Result> {
    readonly score: number;
    readonly obj: CheckInPlayer;
}

type PlayerSuggestionProps = {
    timeCritical: boolean;
    player: { bibNumber: string; name: string; lastName: string };
    typeahead: string;
    onPlayerCheckIn: (bibNumber: string) => void;
    result: CheckinResult;
};
export const PlayerSuggestion = ({ result, typeahead, player, onPlayerCheckIn }: PlayerSuggestionProps) => (
    <button
        onClick={() => onPlayerCheckIn(player.bibNumber)}
        className={classNames("flex w-full select-none items-center rounded-md px-2 py-1 text-sm text-gray-400", {
            ["bg-orange-500 font-semibold text-white"]: typeahead === player.bibNumber,
        })}>
        <div>
            {player.name} {player.lastName}
        </div>
        <div className="flex-grow"></div>
        <div className="">
            {typeahead
                ? fuzzysort.highlight(result[0], (m, i) => (
                      <mark
                          className={classNames("bg-transparent font-semibold text-orange-500", {
                              ["text-white"]: typeahead === player.bibNumber,
                          })}
                          key={i}>
                          {m}
                      </mark>
                  ))
                : player.bibNumber}
        </div>
    </button>
);

type PlayersDialPadProps = {
    timeCritical: boolean;
    onPlayerCheckIn: (bibNumber: string) => void;
    timingPointId?: number;
};

export const PlayersCheckIn = ({ timeCritical, onPlayerCheckIn, timingPointId }: PlayersDialPadProps) => {
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
    const bestGuess = sortedAvailablePlayers[0]?.obj?.bibNumber;

    return (
        <div className="flex h-full flex-col">
            <TypedPlayer reset={() => setPlayerNumber("")} playerNumber={playerNumber} bestGuess={bestGuess} />
            {!!sortedAvailablePlayers?.length && (
                <div className="text-2xs flex w-full justify-between px-12 font-semibold text-gray-400">
                    <div className="uppercase">{t("stopwatch.checkIn.suggestion.player")}</div>
                    <div>{t("stopwatch.checkIn.suggestion.bibNumber")}</div>
                </div>
            )}
            <div className="mx-12 mt-2 flex h-2/5 flex-auto flex-col items-stretch overflow-y-auto text-white">
                {sortedAvailablePlayers.map(p => (
                    <PlayerSuggestion
                        timeCritical={timeCritical}
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
                    timeCritical={timeCritical}
                    availableDigits={getAvailableDigits(playerNumber, playersNumbersWithoutTimeStamps)}
                    number={playerNumber}
                    onNumberChange={setPlayerNumber}
                    canRecord={bestGuess === playerNumber}
                    onRecord={() => {
                        onPlayerCheckIn(bestGuess);
                        setPlayerNumber("");
                    }}
                />
            </div>
        </div>
    );
};
