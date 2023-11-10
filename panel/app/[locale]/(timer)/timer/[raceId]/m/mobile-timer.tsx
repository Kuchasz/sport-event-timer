"use client";

import { mdiChevronDoubleRight } from "@mdi/js";
import Icon from "@mdi/react";
import { sort } from "@set/utils/dist/array";
import { timeOnlyFormatTimeNoSec } from "@set/utils/dist/datetime";
import classNames from "classnames";
import { Clock } from "components/timer/clock";
import { allowedLatency } from "connection";
import { useSystemTime } from "hooks";
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
        ? "&nbsp;".repeat(padBib - player.bibNumber!.toString().length) + player.bibNumber
        : player.bibNumber?.toString() || "";
    return (
        <span
            className={classNames("flex items-center py-2 font-semibold transition-colors duration-500", {
                ["text-orange-500"]: isNext,
                ["text-gray-500"]: hasPassed,
            })}
        >
            {showTime && <span className="font-mono font-bold">{timeOnlyFormatTimeNoSec(player.absoluteStartTime)}</span>}
            <div className="px-4 font-mono font-bold" dangerouslySetInnerHTML={{ __html: bibText }}></div>
            {player.name} {player.lastName}
        </span>
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
    const index = nextStartPlayer ? nextStartPlayerIndex : nextStartPlayerIndex - 1;
    return (
        <div
            style={{
                fontSize: `${clockState.players.size}px`,
            }}
            className="flex w-full overflow-y-auto leading-none transition-all"
        >
            <Icon
                className="visible text-orange-500 transition-transform duration-500 ease-out"
                style={{ transform: `translateY(${32 * index + 2}px) translateX(${nextStartPlayer ? 0 : -26}px)` }}
                size="2em"
                path={mdiChevronDoubleRight}
            />

            <div style={{ padding: "0.1em" }} className="ml-2 flex flex-col justify-between">
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

const NextPlayer = ({ nextStartPlayer }: { nextStartPlayer?: StartListPlayer }) =>
    nextStartPlayer ? (
        <div className="flex flex-col items-center px-4 pb-3 pt-2">
            <div className="flex justify-between text-xs font-bold">
                <div>NEXT PLAYER</div>
                <div className="ml-2">{timeOnlyFormatTimeNoSec(nextStartPlayer?.absoluteStartTime)}</div>
            </div>
            <div className="text-xl">
                <span className="mr-2 rounded-md bg-orange-500 px-2 font-bold">{nextStartPlayer?.bibNumber}</span>
                <span>{nextStartPlayer?.name}</span>
                <span className="ml-2">{nextStartPlayer?.lastName}</span>
            </div>
        </div>
    ) : (
        <div className="flex h-16 flex-col items-center px-4 pb-3 pt-2">
            <div className="flex justify-between text-xs font-bold">
                <div>NO PLAYERS LEFT</div>
            </div>
        </div>
    );

export const MobileTimer = () => {
    const [globalTime, setGlobalTime] = useState<number>(0);
    const ntpMutation = trpc.ntp.sync.useMutation();
    const { raceId } = useParams() as { raceId: string };

    const { data: players } = trpc.player.startList.useQuery(
        { raceId: Number.parseInt(raceId) },
        { enabled: !!raceId, select: data => sort(data, d => d.absoluteStartTime), initialData: [] },
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

    const nextStartPlayer = players.find(p => p.absoluteStartTime - globalTime > 0);
    const maxBibNumber = players.slice(-1)[0]?.bibNumber?.toString().length;
    const nextStartPlayerIndex = nextStartPlayer ? players.indexOf(nextStartPlayer) : players.length;

    return (
        <>
            <div className="relative h-full w-full select-none overflow-hidden bg-black text-white">
                {globalTime === undefined || players === undefined ? (
                    <div className="min-w-screen flex min-h-screen items-center justify-center font-semibold">Smarujemy łańcuch...</div>
                ) : (
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
                )}
            </div>
        </>
    );
};
