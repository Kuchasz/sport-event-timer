"use client";

import Icon from "@mdi/react";
import React from "react";
import { sort } from "@set/utils/dist/array";
import { timeOnlyFormatTimeNoSec } from "@set/utils/dist/datetime";
import { mdiChevronDoubleRight } from "@mdi/js";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AppRouterOutputs } from "trpc";
import { trpc } from "trpc-core";
import classNames from "classnames";
import { Clock } from "components/timer/clock";
import { allowedLatency } from "connection";
import { useSystemTime } from "hooks";

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

const clockTimeout = 100;

const NextPlayer = ({
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
        <span className={classNames("flex items-center mx-1", { ["font-semibold text-orange-500"]: isNext, ["text-gray-500"]: hasPassed })}>
            <Icon className={classNames("visible", { ["invisible"]: !isNext })} size="2em" path={mdiChevronDoubleRight} />
            {showTime && <span className="font-mono font-bold">{timeOnlyFormatTimeNoSec(player.absoluteStartTime)}</span>}
            <div className="px-4 font-bold font-mono" dangerouslySetInnerHTML={{ __html: bibText }}></div>
            {player.name} {player.lastName}
        </span>
    );
};

const Players = ({
    globalTime,
    clockState,
    players,
}: {
    globalTime: number;
    clockState: { players: { size: number } };
    players: StartListPlayer[];
}) => {
    const nextStartPlayer = players.find(p => p.absoluteStartTime - globalTime > 0);
    const maxBibNumber = players.slice(-1)[0]?.bibNumber?.toString().length;
    const nextStartPlayerIndex = nextStartPlayer ? players.indexOf(nextStartPlayer) : players.length;
    return (
        <div
            style={{
                fontSize: `${clockState.players.size}px`,
            }}
            className="leading-none transition-all w-full overflow-y-auto"
        >
            <div style={{ padding: "0.1em" }} className="flex flex-col overflow-y-auto justify-between">
                {players.map((p, index) => (
                    <NextPlayer
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

export const MobileTimer = () => {
    const [globalTime, setGlobalTime] = useState<number>();
    const ntpMutation = trpc.ntp.sync.useMutation();
    const { raceId } = useParams() as { raceId: string };

    const { data: players } = trpc.player.startList.useQuery(
        { raceId: Number.parseInt(raceId! as string) },
        { enabled: !!raceId, select: data => sort(data, d => d.absoluteStartTime) }
    );
    
    const systemTime = useSystemTime(allowedLatency, ntpMutation.mutateAsync);

    useEffect(() => {
        if (systemTime === undefined || players === undefined) return;

        const tickSecondsToPlayer = () => {
            const globalTime = Date.now() + systemTime.timeOffset;
            const globalDateTime = new Date(globalTime);
            const miliseconds = globalDateTime.getMilliseconds();

            if (miliseconds <= clockTimeout) {
                setGlobalTime(globalTime);
            }
        };

        tickSecondsToPlayer();
        const secondsToPlayerInterval = setInterval(tickSecondsToPlayer, clockTimeout);

        return () => {
            clearInterval(secondsToPlayerInterval);
        };
    }, [systemTime, players]);

    return (
        <>
            <div className="select-none bg-black h-full w-full text-white relative overflow-hidden">
                {globalTime === undefined || players === undefined ? (
                    <div className="min-w-screen min-h-screen flex font-semibold justify-center items-center">Smarujemy łańcuch...</div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center">
                        <div className="flex flex-col w-full flex-grow overflow-y-hidden">
                            <Clock fontSize={4} time={globalTime!} />
                            {/* <div className="flex flex-grow items-center flex-col">
                                <Countdown beep={() => {}} fontSize={48} seconds={secondsToNextPlayer} />
                            </div> */}
                            <Players globalTime={globalTime} players={players} clockState={{ players: { size: 16 } }} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};