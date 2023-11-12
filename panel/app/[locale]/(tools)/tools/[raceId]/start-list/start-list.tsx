"use client";

import { mdiCheck, mdiChevronDoubleRight } from "@mdi/js";
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

const StartListPlayer = ({
    padBib,
    isNext,
    hasPassed,
    showTime,
    player,
}: {
    padBib?: number;
    hasPassed?: boolean;
    isNext: boolean;
    showTime?: boolean;
    player: StartListPlayer;
}) => {
    const bibText = padBib
        ? ".".repeat(padBib - player.bibNumber!.toString().length) + player.bibNumber
        : player.bibNumber?.toString() || "";
    const t = useTranslations();
    return (
        <div className="relative flex items-center">
            <Icon
                className={classNames("mx-4 transition-colors duration-500", { ["text-gray-200"]: !hasPassed && !isNext })}
                size={1}
                path={mdiChevronDoubleRight}
            ></Icon>
            <Icon
                className={classNames("absolute mx-4 rounded-full bg-yellow-300 p-1 text-white opacity-0 transition-opacity duration-500", {
                    ["opacity-100"]: hasPassed,
                })}
                size={1}
                path={mdiCheck}
            ></Icon>
            <span
                className={classNames(
                    "my-1 flex flex-1 flex-grow items-center rounded-xl bg-gray-100 p-3 font-semibold transition-colors duration-500",
                    {
                        ["bg-yellow-300"]: isNext,
                        ["opacity-50"]: hasPassed,
                    },
                )}
            >
                <div className="relative flex aspect-square items-center justify-center rounded-xl bg-white p-1 font-mono text-lg font-semibold">
                    <span className="opacity-0">{bibText}</span>
                    <span className="absolute">{player.bibNumber}</span>
                </div>
                <div className="ml-4 flex-grow">
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
    maxBibNumber,
}: {
    maxBibNumber?: number;
    nextStartPlayer?: StartListPlayer;
    nextStartPlayerIndex: number;
    clockState: { players: { size: number } };
    players: StartListPlayer[];
}) => {
    // const index = nextStartPlayer ? nextStartPlayerIndex : nextStartPlayerIndex - 1;
    return (
        <div
            style={{
                fontSize: `${clockState.players.size}px`,
            }}
            className="flex w-full overflow-y-auto leading-none transition-all"
        >
            {/* <Icon
                className="visible text-orange-500 transition-transform duration-500 ease-out"
                style={{ transform: `translateY(${77 * index + 2}px) translateX(${nextStartPlayer ? 0 : -26}px)` }}
                size="2em"
                path={mdiChevronDoubleRight}
            /> */}

            <div className="flex w-full flex-col justify-between pr-4">
                {players.map((p, index) => (
                    <StartListPlayer
                        padBib={maxBibNumber}
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
        <div className="flex flex-col items-center px-4 pb-3 pt-2">
            <div className="flex justify-between text-xs font-bold">
                <div className="uppercase">{t("startList.nextPlayer")}</div>
                <div className="ml-2">{timeOnlyFormatTimeNoSec(nextStartPlayer?.absoluteStartTime)}</div>
            </div>
            <div className="mt-2 text-xl">
                <span className="mr-2 rounded-md bg-yellow-300 px-2 font-bold">{nextStartPlayer?.bibNumber}</span>
                <span>{nextStartPlayer?.name}</span>
                <span className="ml-2">{nextStartPlayer?.lastName}</span>
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center px-4 pb-3 pt-2">
            <div className="flex justify-between text-xs font-bold">
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
    const ntpMutation = trpc.ntp.sync.useMutation();
    const { raceId } = useParams() as { raceId: string };

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

            setGlobalTime(globalTime);

            tickInterval = requestAnimationFrame(tickTime);
        };

        tickTime();

        return () => {
            cancelAnimationFrame(tickInterval);
        };
    }, [systemTime, players]);

    const nextStartPlayer = players?.find(p => p.absoluteStartTime - globalTime > 0);
    const maxBibNumber = players?.slice(-1)[0]?.bibNumber?.toString().length;
    const nextStartPlayerIndex = nextStartPlayer ? players?.indexOf(nextStartPlayer) : players?.length;

    return (
        <>
            <div className="relative h-full w-full select-none overflow-hidden bg-white text-black">
                {/* {nextStartPlayerIndex === undefined ? (
                    <div className="min-w-screen flex min-h-screen items-center justify-center font-semibold">Smarujemy łańcuch...</div>
                ) : ( */}
                <div className="flex h-full w-full flex-col items-center">
                    <div className="flex w-full flex-grow flex-col overflow-y-hidden">
                        <Clock fontSize={3} time={globalTime} />
                        <NextPlayer nextStartPlayer={nextStartPlayer} />
                        <StartList
                            maxBibNumber={maxBibNumber}
                            nextStartPlayer={nextStartPlayer}
                            nextStartPlayerIndex={nextStartPlayerIndex}
                            players={players}
                            clockState={{ players: { size: 16 } }}
                        />
                    </div>
                </div>
                {/* )} */}
            </div>
        </>
    );
};
