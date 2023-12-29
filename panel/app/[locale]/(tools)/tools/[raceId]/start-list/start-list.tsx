"use client";

import { mdiCheckBold, mdiChevronDoubleRight, mdiDebugStepInto } from "@mdi/js";
import Icon from "@mdi/react";
import { sort } from "@set/utils/dist/array";
import { timeOnlyFormatTimeNoSec } from "@set/utils/dist/datetime";
import classNames from "classnames";
import { Clock } from "components/timer/clock";
import { allowedLatency } from "connection";
import { useSystemTime } from "hooks";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "trpc-core";

type StartListPlayer = AppRouterOutputs["player"]["startList"][0];

export type TextSettings = {
    enabled: boolean;
    size: number;
};

export type TextActions = {
    enlargeFont: () => void;
    minifyFont: () => void;
    toggle: () => void;
};

const PlayerBibNumber = ({ maxBibNumberLength, bibNumber }: { maxBibNumberLength: number; bibNumber: string }) => {
    const bibText = maxBibNumberLength
        ? ".".repeat(maxBibNumberLength - bibNumber.toString().length) + bibNumber
        : bibNumber.toString() || "";

    return (
        <div className="mx-2 flex flex-col rounded-md bg-gray-100 p-1">
            <div className="relative flex items-center justify-center rounded-xl text-lg font-bold">
                <span className="font-mono opacity-0">{bibText}</span>
                <span className="absolute">{bibNumber}</span>
            </div>
        </div>
    );
};

const StartListPlayer = ({
    maxBibNumberLength,
    isNext,
    hasPassed,
    showTime,
    player,
}: {
    maxBibNumberLength?: number;
    hasPassed?: boolean;
    isNext: boolean;
    showTime?: boolean;
    player: StartListPlayer;
}) => {
    const t = useTranslations();
    return (
        <div id={isNext ? "next" : undefined} className="relative flex items-center">
            <Icon
                className={classNames("transition-opacity duration-500", {
                    ["opacity-20"]: !hasPassed && !isNext,
                    ["opacity-0"]: hasPassed,
                })}
                size={1}
                path={mdiChevronDoubleRight}></Icon>
            <Icon
                className={classNames("absolute ml-1 opacity-0 transition-opacity duration-500", {
                    ["opacity-100"]: hasPassed,
                })}
                size={0.7}
                path={mdiCheckBold}></Icon>
            <PlayerBibNumber bibNumber={player.bibNumber} maxBibNumberLength={maxBibNumberLength!} />
            <span
                className={classNames(
                    "my-1 flex flex-1 flex-grow items-center rounded-xl bg-gray-100 px-4 py-3 font-semibold transition-colors duration-500",
                    {
                        ["bg-yellow-300"]: isNext,
                        ["opacity-50"]: hasPassed,
                    },
                )}>
                <div className="flex-grow">
                    <div className="font-normal">{player.name}</div>
                    <div className="mt-1.5 font-bold">{player.lastName}</div>
                </div>

                {showTime && (
                    <div className="flex flex-col items-end">
                        <div className="text-2xs font-bold uppercase opacity-40">{t("startList.startTime")}</div>
                        <div className="mt-1">{timeOnlyFormatTimeNoSec(player.absoluteStartTime)}</div>
                    </div>
                )}
            </span>
        </div>
    );
};

const StartList = ({
    clockState,
    players,
    nextStartPlayer,
    nextStartPlayerIndex,
    maxBibNumberLength,
}: {
    maxBibNumberLength?: number;
    nextStartPlayer?: StartListPlayer;
    nextStartPlayerIndex: number;
    clockState: { players: { size: number } };
    players: StartListPlayer[];
}) => {
    return (
        <div
            style={{
                fontSize: `${clockState.players.size}px`,
            }}
            className="flex w-full overflow-y-auto px-2 leading-none transition-all">
            <div className="flex w-full flex-col justify-between">
                {players.map((p, index) => (
                    <StartListPlayer
                        maxBibNumberLength={maxBibNumberLength}
                        isNext={p.bibNumber === nextStartPlayer?.bibNumber}
                        hasPassed={index < nextStartPlayerIndex}
                        showTime={true}
                        key={p.bibNumber}
                        player={p}
                    />
                ))}
            </div>
        </div>
    );
};

const NextPlayer = ({ nextStartPlayer }: { nextStartPlayer?: StartListPlayer }) => {
    const t = useTranslations();
    return nextStartPlayer ? (
        <div className="flex w-full flex-col bg-yellow-300 px-4 pb-4 pt-2">
            <div className="flex w-full justify-between bg-black px-1 py-0.5 text-xs font-bold uppercase text-yellow-300">
                <div>{t("startList.nextPlayer")}</div>
                <div className="ml-2">
                    {t("startList.headerStartTime")}
                    {timeOnlyFormatTimeNoSec(nextStartPlayer?.absoluteStartTime)}
                </div>
            </div>
            <div className="mt-2 flex items-center text-xl">
                <span className="mr-2 rounded-md bg-white px-2 py-1 font-bold">{nextStartPlayer?.bibNumber}</span>
                <span className="mr-2 font-bold">{nextStartPlayer?.lastName}</span>
                <span>{nextStartPlayer?.name}</span>
                <span className="flex-grow"></span>
                <a
                    onClick={() => document.querySelector("#next")?.scrollIntoView({ behavior: "smooth" })}
                    className="cursor-pointer rounded-full p-2 hover:bg-yellow-200">
                    <Icon size={1} path={mdiDebugStepInto} />
                </a>
            </div>
        </div>
    ) : (
        <div className="flex w-full flex-col items-center justify-center bg-yellow-300 px-4 pb-4 pt-2">
            <div className="flex w-full bg-black px-1 py-0.5 text-xs font-bold text-yellow-300">
                <div className="uppercase">{t("startList.noPlayersLeft")}</div>
                <div className="ml-2 opacity-0">...</div>
            </div>
            <div className="mt-2 text-xl opacity-0">
                <span className="mr-2 rounded-md bg-yellow-300 px-2 font-bold">...</span>
                <span className="ml-2">...</span>
            </div>
        </div>
    );
};

export const RaceStartList = ({ players: initialData, renderTime }: { players: StartListPlayer[]; renderTime: number }) => {
    const [globalTime, setGlobalTime] = useState<number>(renderTime);
    const [secondsToNextPlayer, setSecondsToNextPlayer] = useState<number>(0);
    const ntpMutation = trpc.ntp.sync.useMutation();
    const { raceId } = useParams<{ raceId: string }>()!;

    const { data: players } = trpc.player.startList.useQuery(
        { raceId: Number.parseInt(raceId) },
        { enabled: !!raceId, select: data => sort(data, d => d.absoluteStartTime), initialData },
    );

    const systemTime = useSystemTime(allowedLatency, ntpMutation.mutateAsync);

    useEffect(() => {
        if (systemTime === undefined || players === undefined) return;

        let tickInterval: number;

        const tickTime = () => {
            const globalTime = Date.now() + systemTime.timeOffset;

            const nextPlayers = players.filter(p => p.absoluteStartTime - globalTime > 0);
            const nextPlayer = nextPlayers[0];
            const nextPlayerTimeToStart = nextPlayer?.absoluteStartTime - globalTime;
            const secondsToNextStart = Math.floor(nextPlayerTimeToStart / 1_000);

            setSecondsToNextPlayer(secondsToNextStart);
            setGlobalTime(globalTime);

            tickInterval = requestAnimationFrame(tickTime);
        };

        tickTime();

        return () => {
            cancelAnimationFrame(tickInterval);
        };
    }, [systemTime, players]);

    const nextStartPlayer = players?.find(p => p.absoluteStartTime - globalTime > 0);
    const maxBibNumberLength = Math.max(...players?.map(p => p?.bibNumber?.toString().length ?? 0));
    const nextStartPlayerIndex = nextStartPlayer ? players?.indexOf(nextStartPlayer) : players?.length;

    return (
        <div className="flex w-full flex-col items-center overflow-hidden">
            <div className="relative h-full w-full select-none overflow-hidden bg-white text-black lg:max-w-lg">
                <div className="flex h-full w-full flex-col items-center">
                    <div className="flex w-full flex-grow flex-col overflow-y-hidden">
                        <div className="bg-yellow-300">
                            <Clock fontSize={1} time={globalTime} />
                            {secondsToNextPlayer}
                        </div>
                        <NextPlayer nextStartPlayer={nextStartPlayer} />
                        <StartList
                            maxBibNumberLength={maxBibNumberLength}
                            nextStartPlayer={nextStartPlayer}
                            nextStartPlayerIndex={nextStartPlayerIndex}
                            players={players}
                            clockState={{ players: { size: 16 } }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
