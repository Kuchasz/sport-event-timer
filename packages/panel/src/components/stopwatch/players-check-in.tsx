import { Transition } from "@headlessui/react";
import { mdiCheck, mdiChevronRight, mdiClose, mdiTimerPlusOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { createRange, sort } from "@set/utils/dist/array";
import classNames from "classnames";
import fuzzysort from "fuzzysort";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import { trpc } from "src/trpc-core";
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
    const playerNumberDigits = playerNumber.split("");
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

type CheckInPlayer = { bibNumber: string; name: string; lastName: string };

type PlayerSuggestionProps = {
    timeCritical: boolean;
    player: { bibNumber: string; name: string; nextSplit: { name: string; id: number }; lastName: string };
    typeahead: string;
    onPlayerCheckIn: (bibNumber: string) => void;
    result: Fuzzysort.KeysResult<CheckInPlayer>;
    showSplit: boolean;
};
export const PlayerSuggestion = ({ result, typeahead, player, onPlayerCheckIn, showSplit }: PlayerSuggestionProps) => {
    return (
        <button
            onClick={() => onPlayerCheckIn(player.bibNumber)}
            className={classNames(
                "my-1 flex w-full select-none items-center rounded-md px-2 py-1 text-sm text-gray-500 transition-colors",
                {
                    ["bg-orange-50 text-orange-500"]: typeahead === player.bibNumber,
                    ["bg-zinc-50"]: typeahead !== player.bibNumber,
                },
            )}>
            <div className={classNames("mr-1 rounded-full", typeahead === player.bibNumber ? "text-orange-500" : "")}>
                <Icon size={0.8} path={mdiChevronRight}></Icon>
            </div>
            <div className="font-semibold">
                {player.name[0]}. {player.lastName}
            </div>
            <div className="flex-grow"></div>
            <div className=" font-semibold">
                {typeahead
                    ? result[0].highlight((m, i) => (
                          <mark className={classNames("bg-transparent text-orange-500")} key={i}>
                              {m}
                          </mark>
                      ))
                    : player.bibNumber}
            </div>
            {showSplit && (
                <div className={classNames("ml-2 text-xs font-medium", typeahead === player.bibNumber ? "" : "opacity-50")}>
                    {player.nextSplit.name}
                </div>
            )}
        </button>
    );
};

type PlayersDialPadProps = {
    timeCritical: boolean;
    onPlayerCheckIn: (params: { bibNumber: string; splitId: number }) => void;
    timingPointId?: number;
};

export const PlayersCheckIn = ({ timeCritical, onPlayerCheckIn, timingPointId }: PlayersDialPadProps) => {
    const [playerNumber, setPlayerNumber] = useState("");

    const { raceId } = useParams<{ raceId: string }>()!;
    const t = useTranslations();

    const { data: allPlayers } = trpc.player.stopwatchPlayers.useQuery({ raceId: parseInt(raceId) }, { initialData: [] });

    const { data: splits } = trpc.split.orderedByTimingPoint.useQuery(
        { raceId: parseInt(raceId), timingPointId: timingPointId! },
        { enabled: timingPointId !== undefined, initialData: [] },
    );

    const allSplitTimes = useTimerSelector(x => x.splitTimes);
    const allAbsences = useTimerSelector(x => x.absences);

    const playersWithSplitTimes = allPlayers
        .map(x => ({
            ...x,
            splitTimes: allSplitTimes.filter(a => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
            absences: allAbsences.filter(a => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
            applicableSplits: splits.filter(s => s.classificationId === x.classificationId && s.timingPointId === timingPointId),
        }))
        .map(x => ({ ...x, usedSplits: [...x.splitTimes.map(s => s.splitId!), ...x.absences.map(a => a.splitId)] }))
        .map(x => ({ ...x, nextSplit: x.applicableSplits.find(c => !x.usedSplits.includes(c.id)) }));

    const nonAbsentPlayersWithoutSplitTime = playersWithSplitTimes.filter(p => p.nextSplit);

    const availablePlayers = sort(
        nonAbsentPlayersWithoutSplitTime.map(a => ({
            ...a,
            nextSplit: a.nextSplit!,
            bibNumber: a.bibNumber.toString(),
        })),
        p => parseInt(p.bibNumber),
    );

    const sortedAvailablePlayers = fuzzysort.go(playerNumber, playerNumber ? availablePlayers : [], { all: true, keys: ["bibNumber"] });
    const bestGuess = sortedAvailablePlayers[0]?.obj;

    const canRecord = bestGuess?.bibNumber === playerNumber;
    const onRecord = () => {
        onPlayerCheckIn({ bibNumber: bestGuess.bibNumber, splitId: bestGuess.nextSplit.id });
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
                        showSplit={splits.length > 1}
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
            <div className="my-3 flex flex-col px-5">
                <div
                    onPointerDown={timeCritical ? onRecord : undefined}
                    onClick={!timeCritical ? onRecord : undefined}
                    className={classNames(
                        "active:animate-pushInLittle flex items-center justify-center rounded-md bg-gradient-to-b from-orange-500 to-red-500 p-4 font-semibold text-white shadow-md transition-opacity",
                        canRecord ? "animate-wave" : "pointer-events-none opacity-20",
                    )}>
                    {canRecord ? <span>{bestGuess.nextSplit.name}</span> : <span>{t("stopwatch.checkIn.split")}</span>}
                    <Icon className="ml-4" size={1.4} path={timeCritical ? mdiTimerPlusOutline : mdiCheck}></Icon>
                </div>
            </div>
        </div>
    );
};
