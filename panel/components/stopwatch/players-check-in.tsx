import { Transition } from "@headlessui/react";
import { mdiCheck, mdiChevronRight, mdiClose, mdiTimerPlusOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { createRange, sort } from "@set/utils/dist/array";
import classNames from "classnames";
import fuzzysort from "fuzzysort";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { trpc } from "trpc-core";
import { useTimerSelector } from "../../hooks";
import { DialPad } from "./dial-pad";

const typedNumberDigits = createRange({ from: 0, to: 9 });

const storedDigits: Record<number, string> = {};
const getDigitForIndex = (idx: number, value: string) => {
    if (value !== undefined) {
        storedDigits[idx] = value;
    }

    return storedDigits[idx];
};

type TypedPlayerProps = {
    playerNumber: string;
    reset: () => void;
};

export const TypedPlayer = ({ reset, playerNumber }: TypedPlayerProps) => {
    const playerNumberDigits = [...playerNumber];
    const t = useTranslations();
    return (
        <div className="flex flex-col items-center px-12">
            <div className="mt-6 flex w-full items-center justify-between">
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
                        className={classNames(
                            "absolute flex items-center text-sm text-gray-300 opacity-0 transition-all",
                            {
                                ["opacity-100"]: !playerNumber,
                            },
                            playerNumber ? "translate-y-full" : "translate-y-0",
                        )}>
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
interface CheckInResult extends ReadonlyArray<Result> {
    readonly score: number;
    readonly obj: CheckInPlayer;
}

type PlayerSuggestionProps = {
    timeCritical: boolean;
    player: { bibNumber: string; name: string; timeStampsNumber: number; lastName: string };
    typeahead: string;
    onPlayerCheckIn: (bibNumber: string) => void;
    result: CheckInResult;
    displayLaps: boolean;
};
export const PlayerSuggestion = ({ result, typeahead, player, onPlayerCheckIn, displayLaps }: PlayerSuggestionProps) => {
    const t = useTranslations();
    return (
        <button
            onClick={() => onPlayerCheckIn(player.bibNumber)}
            className={classNames("my-1 flex w-full select-none items-center rounded-md px-2 py-1 text-sm text-gray-500", {
                ["bg-orange-50 text-orange-500"]: typeahead === player.bibNumber,
                ["bg-zinc-50"]: typeahead !== player.bibNumber,
            })}>
            <div className={classNames("mr-1 rounded-full", typeahead === player.bibNumber ? "text-orange-500" : "")}>
                <Icon size={0.8} path={mdiChevronRight}></Icon>
            </div>
            <div className="font-semibold">
                {player.name[0]}. {player.lastName}
            </div>
            <div className="flex-grow"></div>
            <div className=" font-semibold">
                {typeahead
                    ? fuzzysort.highlight(result[0], (m, i) => (
                          <mark className={classNames("bg-transparent text-orange-500")} key={i}>
                              {m}
                          </mark>
                      ))
                    : player.bibNumber}
            </div>
            {displayLaps && (
                <div className={classNames("ml-2 text-xs font-medium", typeahead === player.bibNumber ? "" : "opacity-50")}>
                    {t("stopwatch.checkIn.lap")} {player.timeStampsNumber + 1}
                </div>
            )}
        </button>
    );
};

type PlayersDialPadProps = {
    timeCritical: boolean;
    onPlayerCheckIn: (bibNumber: string) => void;
    timingPointId?: number;
};

export const PlayersCheckIn = ({ timeCritical, onPlayerCheckIn, timingPointId }: PlayersDialPadProps) => {
    const [playerNumber, setPlayerNumber] = useState("");

    const { raceId } = useParams<{ raceId: string }>()!;

    const { data: allPlayers } = trpc.player.stopwatchPlayers.useQuery({ raceId: parseInt(raceId) }, { initialData: [] });
    const { data: timingPoint } = trpc.timingPoint.timingPoint.useQuery(
        { raceId: parseInt(raceId), timingPointId: timingPointId! },
        { enabled: timingPointId !== undefined },
    );

    const allTimeStamps = useTimerSelector(x => x.timeStamps);
    const allAbsences = useTimerSelector(x => x.absences);

    const maxSplitTimes = (timingPoint?.laps ?? 0) + 1;

    const playersWithTimeStamps = allPlayers.map(x => ({
        ...x,
        timeStamps: allTimeStamps.filter(a => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
        absent: allAbsences.find(a => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
    }));

    const nonAbsentPlayersWithoutTimeStamps = playersWithTimeStamps.filter(
        x => x.timeStamps.length < maxSplitTimes && x.absent === undefined,
    );

    const availablePlayers = sort(
        nonAbsentPlayersWithoutTimeStamps.map(a => ({ ...a, timeStampsNumber: a.timeStamps.length, bibNumber: a.bibNumber.toString() })),
        p => parseInt(p.bibNumber),
    );

    const sortedAvailablePlayers = fuzzysort.go(playerNumber, playerNumber ? availablePlayers : [], { all: true, keys: ["bibNumber"] });
    const bestGuess = sortedAvailablePlayers[0]?.obj;

    const canRecord = bestGuess?.bibNumber === playerNumber;
    const onRecord = () => {
        onPlayerCheckIn(bestGuess.bibNumber);
        setPlayerNumber("");
    };

    return (
        <div className="flex h-full flex-col">
            <div className="mx-12 mt-6 flex flex-1 flex-col-reverse items-stretch overflow-y-auto text-white">
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
                        displayLaps={(timingPoint?.laps || 0) > 0}
                    />
                ))}
            </div>
            <TypedPlayer reset={() => setPlayerNumber("")} playerNumber={playerNumber} />
            <div className="flex basis-72 flex-col items-center bg-white">
                <DialPad
                    timeCritical={timeCritical}
                    number={playerNumber}
                    onNumberChange={setPlayerNumber}
                    canRecord={canRecord}
                    onRecord={onRecord}
                />
            </div>
            <div
                onPointerDown={timeCritical ? onRecord : undefined}
                onClick={!timeCritical ? onRecord : undefined}
                className={classNames(
                    "active:animate-pushInLittle flex justify-center bg-gradient-to-b from-orange-500 to-red-500 p-4 text-white transition-opacity",
                    canRecord ? "animate-wave" : "pointer-events-none opacity-20",
                )}>
                <Icon size={1.4} path={timeCritical ? mdiTimerPlusOutline : mdiCheck}></Icon>
            </div>
        </div>
    );
};
