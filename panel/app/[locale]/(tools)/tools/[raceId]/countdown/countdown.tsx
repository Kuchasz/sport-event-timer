"use client";

import Icon from "@mdi/react";
import React from "react";
import type { BeepFunction } from "@set/utils/dist/beep";
import { createBeep } from "@set/utils/dist/beep";
import { Clock } from "../../../../../../components/timer/clock";
import { ConfigMenu } from "../../../../../../components/timer/config-menu";
import { Countdown } from "components/timer/countdown";
import { sort } from "@set/utils/dist/array";
import { timeOnlyFormatTimeNoSec, getCountdownTime } from "@set/utils/dist/datetime";
import { mdiChevronDoubleRight, mdiCog, mdiInformationOutline, mdiVolumeHigh, mdiVolumeOff } from "@mdi/js";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import type { TimerSettings } from "states/timer-states";
import { timerSettingsAtom } from "states/timer-states";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "trpc-core";
import classNames from "classnames";
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
        <span className={classNames("mx-1 flex items-center", { ["font-semibold text-orange-500"]: isNext, ["text-gray-500"]: hasPassed })}>
            <Icon className={classNames("visible", { ["invisible"]: !isNext })} size="2em" path={mdiChevronDoubleRight} />
            {showTime && <span className="font-mono font-bold">{timeOnlyFormatTimeNoSec(player.absoluteStartTime)}</span>}
            <div className="p-1 font-mono" dangerouslySetInnerHTML={{ __html: bibText }}></div>
            {player.name} {player.lastName}
        </span>
    );
};

const NoPlayersLeft = () => (
    <span className="flex items-center first:font-semibold" style={{ marginInline: "0.25em" }}>
        <Icon size="1.5em" path={mdiInformationOutline} />
        <div
            style={{
                paddingInline: "0.25em",
                paddingBlock: "0.1em",
            }}
        >
            No players left
        </div>
    </span>
);

const NextPlayers = ({ clockState, players }: { clockState: TimerSettings; players: StartListPlayer[] }) => {
    return (
        <div
            style={{
                fontSize: `${clockState.nextPlayers.size}px`,
            }}
            className="w-full overflow-y-auto leading-none transition-all"
        >
            <div style={{ padding: "0.1em" }} className="flex justify-between overflow-y-auto">
                {players.length > 0 ? (
                    players.map((p, index) => <NextPlayer isNext={index === 0} key={p.bibNumber} player={p} />)
                ) : (
                    <NoPlayersLeft />
                )}
            </div>
        </div>
    );
};

const Latency = ({ latency }: { latency: number }) => {
    const [showLatency, setShowLatency] = useState<boolean>(false);
    return (
        <div className="flex items-center p-2" onClick={() => setShowLatency(!showLatency)}>
            <span
                className={classNames("block h-4 w-4 rounded-full", {
                    ["bg-orange-500"]: latency > allowedLatency,
                    ["bg-lime-500"]: latency <= allowedLatency,
                })}
            ></span>
            <span className={classNames("ml-2 font-semibold transition-opacity", { ["opacity-0"]: !showLatency })}>{latency}ms</span>
        </div>
    );
};

const Players = ({ globalTime, clockState, players }: { globalTime: number; clockState: TimerSettings; players: StartListPlayer[] }) => {
    const nextStartPlayer = players.find(p => p.absoluteStartTime - globalTime > 0);
    const maxBibNumber = players.slice(-1)[0]?.bibNumber?.toString().length;
    const nextStartPlayerIndex = nextStartPlayer ? players.indexOf(nextStartPlayer) : players.length;
    return (
        <div
            style={{
                fontSize: `${clockState.players.size}px`,
            }}
            className="w-full max-w-[30%] overflow-y-auto leading-none transition-all"
        >
            <div style={{ padding: "0.1em" }} className="flex flex-col justify-between overflow-y-auto">
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

export const RaceCountdown = () => {
    const [globalTime, setGlobalTime] = useState<number>();
    const [clockState, setClockState] = useAtom(timerSettingsAtom);
    const [beep, setBeep] = useState<BeepFunction | undefined>(undefined);
    const { raceId } = useParams<{ raceId: string }>()!;
    const ntpMutation = trpc.ntp.sync.useMutation();

    const systemTime = useSystemTime(allowedLatency, ntpMutation.mutateAsync);

    const { data: players } = trpc.player.startList.useQuery(
        { raceId: Number.parseInt(raceId) },
        { enabled: !!raceId, select: data => sort(data, d => d.absoluteStartTime) },
    );

    const [nextPlayers, setNextPlayers] = useState<StartListPlayer[]>([]);
    const [secondsToNextPlayer, setSecondsToNextPlayer] = useState<number>(0);

    const toggleSoundEnabled = () => {
        setBeep(beep ? undefined : createBeep);
    };

    const toggleMenu = () => {
        setClockState({
            ...clockState,
            showSettings: !clockState.showSettings,
        });
    };

    useEffect(() => {
        if (systemTime === undefined || players === undefined) return;

        let tickInterval: number;

        const tickTime = () => {
            const globalTime = Date.now() + systemTime.timeOffset;

            const nextPlayers = players.filter(p => p.absoluteStartTime - globalTime > 0);

            const nextPlayer = nextPlayers[0];

            const nextPlayerTimeToStart = nextPlayer?.absoluteStartTime - globalTime;

            const secondsToNextStart = Math.floor((nextPlayerTimeToStart || getCountdownTime(globalTime)) / 1_000);

            setNextPlayers(nextPlayers.slice(0, clockState.nextPlayers.count));
            setSecondsToNextPlayer(secondsToNextStart);
            setGlobalTime(globalTime);

            tickInterval = requestAnimationFrame(tickTime);
        };

        tickTime();

        return () => {
            cancelAnimationFrame(tickInterval);
        };
    }, [systemTime, players]);

    return (
        <>
            <div className="relative h-full w-full select-none overflow-hidden bg-black text-white">
                {globalTime === undefined || players === undefined ? (
                    <div className="min-w-screen flex min-h-screen items-center justify-center font-semibold">Smarujemy łańcuch...</div>
                ) : (
                    <div className="flex h-full w-full flex-col items-center">
                        <div className="flex w-full justify-between">
                            <div className="flex items-center self-start">
                                <div onClick={toggleMenu} className="cursor-pointer p-4">
                                    <Icon size={1.5} path={mdiCog} />
                                </div>
                                <div onClick={toggleSoundEnabled} className="cursor-pointer p-4">
                                    <Icon size={1.5} path={beep !== undefined ? mdiVolumeHigh : mdiVolumeOff} />
                                </div>
                                {systemTime && <Latency latency={systemTime.latency} />}
                            </div>
                            {clockState.clock.enabled && <Clock fontSize={clockState.clock.size} time={globalTime} />}
                        </div>

                        <div className="flex w-full flex-grow overflow-y-hidden">
                            <div className="flex flex-grow flex-col items-center">
                                {clockState.countdown.enabled && (
                                    <Countdown beep={beep} fontSize={clockState.countdown.size} seconds={secondsToNextPlayer} />
                                )}
                                {clockState.currentPlayer.enabled && nextPlayers.length > 0 && (
                                    <div
                                        className="transition-all"
                                        style={{
                                            fontSize: `${clockState.currentPlayer.size}px`,
                                        }}
                                    >
                                        <NextPlayer isNext={true} player={nextPlayers[0]} />
                                    </div>
                                )}
                                {clockState.nextPlayers.enabled && <NextPlayers players={nextPlayers} clockState={clockState} />}
                            </div>
                            {clockState.players.enabled && <Players globalTime={globalTime} players={players} clockState={clockState} />}
                        </div>
                        {clockState.showSettings && (
                            <ConfigMenu clockState={clockState} toggleMenu={toggleMenu} setClockState={setClockState} />
                        )}
                    </div>
                )}
            </div>
        </>
    );
};
