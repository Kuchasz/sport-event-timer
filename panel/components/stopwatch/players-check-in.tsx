import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { sort } from "@set/utils/dist/array";
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
    timeCritical: boolean;
    playerNumber: string;
    bestGuess?: string;
    onPlayerCheckIn: (bibNumber: string) => void;
    reset: () => void;
};

export const TypedPlayer = ({ timeCritical, onPlayerCheckIn, reset, playerNumber, bestGuess }: TypedPlayerProps) => {
    const t = useTranslations();
    return (
        <div className="flex flex-col items-center px-12">
            <div className="mt-2 rounded-full bg-gray-300 px-2 py-0.5 text-xs font-semibold text-white">
                {t("stopwatch.checkIn.tapToRecord")}
            </div>
            <div className="my-4 flex w-full items-center justify-between">
                <div className="invisible">
                    <Icon size={0.8} path={mdiClose}></Icon>
                </div>
                <div
                    onPointerDown={timeCritical ? () => playerNumber && onPlayerCheckIn(bestGuess ?? playerNumber) : undefined}
                    onClick={!timeCritical ? () => playerNumber && onPlayerCheckIn(bestGuess ?? playerNumber) : undefined}
                    className="flex flex-grow justify-center text-center text-4xl">
                    <div className="text-orange-500">{playerNumber}</div>
                    <span className="text-gray-300">{bestGuess?.slice(playerNumber.length)}</span>
                </div>
                <div onClick={reset} className={classNames("opacity-60", { ["invisible"]: !bestGuess })}>
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

    return (
        <div className="flex h-full flex-col">
            <TypedPlayer
                timeCritical={timeCritical}
                onPlayerCheckIn={bibNumber => {
                    onPlayerCheckIn(bibNumber);
                    setPlayerNumber("");
                }}
                reset={() => setPlayerNumber("")}
                playerNumber={playerNumber}
                bestGuess={sortedAvailablePlayers[0]?.obj?.bibNumber}
            />
            {!!sortedAvailablePlayers?.length && (
                <div className="text-2xs flex w-full justify-between px-12 font-semibold text-gray-400">
                    <div className="uppercase">{t("stopwatch.checkIn.suggestion.player")}</div>
                    <div>{t("stopwatch.checkIn.suggestion.bibNumber")}</div>
                </div>
            )}
            <div className="mx-12 mt-2 flex h-2/5 flex-auto flex-col items-stretch overflow-y-auto text-white">
                {sortedAvailablePlayers.slice(0, 10).map(p => (
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
                    availableDigits={getAvailableDigits(playerNumber, playersNumbersWithoutTimeStamps)}
                    number={playerNumber}
                    onNumberChange={setPlayerNumber}
                />
            </div>
        </div>
    );
};
