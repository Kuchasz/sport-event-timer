"use client";

import { mdiAccountOffOutline, mdiChevronDoubleRight, mdiDebugStepInto } from "@mdi/js";
import Icon from "@mdi/react";
import { sort } from "@set/utils/dist/array";
import { timeOnlyFormatTimeNoSec } from "@set/utils/dist/datetime";
import classNames from "classnames";
import { Clock } from "src/components/timer/clock";
import { allowedLatency } from "src/connection";
import { useSystemTime } from "src/hooks";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { AppRouterOutputs } from "src/trpc";
import { trpc } from "src/trpc-core";
import { formatSecondsToTimeSpan } from "src/utils";

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

const PlayerBibNumber = ({
    hasPassed,
    maxBibNumberLength,
    bibNumber,
}: {
    hasPassed?: boolean;
    maxBibNumberLength: number;
    bibNumber: string;
}) => {
    const bibText = maxBibNumberLength
        ? ".".repeat(maxBibNumberLength - bibNumber.toString().length) + bibNumber
        : bibNumber.toString() || "";

    return (
        <div className="mr-3 flex flex-col rounded-md">
            <div className="relative flex items-center justify-center rounded-xl text-lg font-bold">
                <span className="font-mono opacity-0">{bibText}</span>
                <span className={classNames("absolute", { ["opacity-50"]: hasPassed })}>{bibNumber}</span>
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
            <div
                className={classNames("mr-2 w-5 overflow-hidden transition-all duration-500", {
                    ["opacity-20"]: !hasPassed && !isNext,
                    ["hidden"]: hasPassed,
                })}>
                <Icon size={1} path={mdiChevronDoubleRight}></Icon>
            </div>
            <span
                className={classNames(
                    "my-1 flex flex-1 flex-grow items-center rounded-xl bg-gray-100 px-4 py-3 font-semibold transition-colors duration-500",
                    {
                        ["bg-gradient-to-b from-yellow-400 to-yellow-500 text-white"]: isNext,
                        ["opacity-50"]: hasPassed,
                    },
                )}>
                <PlayerBibNumber hasPassed={hasPassed} bibNumber={player.bibNumber} maxBibNumberLength={maxBibNumberLength!} />
                <div className="flex-grow">
                    <div className="font-normal">{player.name}</div>
                    <div className="mt-1.5 font-bold">{player.lastName}</div>
                </div>

                {showTime && (
                    <div className="flex flex-col items-end">
                        <div className="text-2xs font-bold uppercase opacity-50">{t("startList.startTime")}</div>
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
    const t = useTranslations();
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
                {players.length === 0 && (
                    <div className="my-1 flex flex-1 flex-grow flex-col items-center  rounded-xl bg-gray-100 px-4 py-6 text-xs font-semibold transition-colors duration-500">
                        <div className="rounded-sm bg-white p-1 text-gray-300">
                            <Icon path={mdiAccountOffOutline} size={1} />
                        </div>
                        <div className="mt-3 rounded-sm bg-white px-2 py-1 uppercase text-gray-300">{t("startList.empty")}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

const NextPlayer = ({ nextStartPlayer, globalTime }: { nextStartPlayer?: StartListPlayer; globalTime: number }) => {
    const t = useTranslations();
    return nextStartPlayer ? (
        <div className="flex w-full flex-col">
            <div className="flex w-full justify-between text-xs font-bold uppercase text-yellow-500">
                <div className="rounded-sm bg-white px-1 py-0.5">{t("startList.nextPlayer")}</div>
                <Clock className="text-sm text-white" time={globalTime} style={{ margin: "0px", padding: "0px" }} />
            </div>
            <div className="mt-2 flex items-center text-xl">
                <span className="mr-2 rounded-md bg-white px-2 py-1 font-bold text-yellow-500">{nextStartPlayer?.bibNumber}</span>
                <span className="mr-2 font-bold">{nextStartPlayer?.lastName}</span>
                <span>{nextStartPlayer?.name}</span>
                <span className="flex-grow"></span>
                <div className="relative flex flex-grow basis-0 flex-col items-end justify-center">
                    <div className="flex flex-col items-end leading-none">
                        <div className="text-2xs font-bold uppercase opacity-50">{t("startList.startTime")}</div>
                        <div className="font-semibold">{timeOnlyFormatTimeNoSec(nextStartPlayer.absoluteStartTime)}</div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex w-full flex-col">
            <div className="flex w-full justify-between text-xs font-bold uppercase text-yellow-500">
                <div className="rounded-sm bg-white px-1 py-0.5">{t("startList.noPlayersLeft")}</div>
                <Clock className="text-sm text-white" time={globalTime} style={{ margin: "0px", padding: "0px" }} />
            </div>
        </div>
    );
};

const NextPlayerStartInfo = ({ secondsToNextPlayer }: { secondsToNextPlayer: number }) => {
    const t = useTranslations();
    return (
        <>
            <div className="flex">
                <div className="flex-grow basis-0"></div>
                <div className="flex flex-col items-center">
                    <div className="mb-2 flex flex-col items-center">
                        <div className="font-mono text-4xl font-bold">{formatSecondsToTimeSpan(secondsToNextPlayer)}</div>
                        <div className="text-xs font-semibold opacity-75">{t("startList.startsIn")}</div>
                    </div>
                </div>
                <div className="relative flex flex-grow basis-0 flex-col items-end justify-center">
                    <a
                        onClick={() => document.querySelector("#next")?.scrollIntoView({ behavior: "smooth" })}
                        className="absolute m-1 cursor-pointer rounded-full p-1 hover:bg-white hover:bg-opacity-25">
                        <Icon size={1} path={mdiDebugStepInto} />
                    </a>
                </div>
            </div>
            <div className="relative flex h-2 w-full justify-end overflow-hidden rounded-full">
                <div
                    style={{
                        width: secondsToNextPlayer > 60 ? "100%" : `${(secondsToNextPlayer / 60) * 100}%`,
                    }}
                    className={classNames("absolute h-full rounded-full bg-white transition-all duration-1000 ease-linear")}></div>
                <div className="h-full w-full bg-white opacity-25"></div>
            </div>
        </>
    );
};

export const RaceStartList = ({
    raceId,
    players: initialData,
    renderTime,
}: {
    raceId: number;
    players: StartListPlayer[];
    renderTime: number;
}) => {
    const [globalTime, setGlobalTime] = useState<number>(renderTime);
    const [secondsToNextPlayer, setSecondsToNextPlayer] = useState<number>(0);
    const ntpMutation = trpc.ntp.sync.useMutation();

    const { data: players } = trpc.player.startList.useQuery(
        { raceId },
        { select: data => sort(data, d => d.absoluteStartTime), initialData },
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
                        <div className="rounded-b-xl bg-gradient-to-b from-yellow-400 to-yellow-500 p-4 text-white">
                            <NextPlayer globalTime={globalTime} nextStartPlayer={nextStartPlayer} />
                            {nextStartPlayer && <NextPlayerStartInfo secondsToNextPlayer={secondsToNextPlayer} />}
                        </div>
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
