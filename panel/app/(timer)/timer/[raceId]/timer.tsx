"use client";

import Icon from "@mdi/react";
import React from "react";
import { BeepFunction, createBeep } from "@set/utils/dist/beep";
import { Clock } from "../../../../components/timer/clock";
import { ConfigMenu } from "../../../../components/timer/config-menu";
import { Countdown } from "components/timer/countdown";
import { sort } from "@set/utils/dist/array";
import { timeOnlyFormatTimeNoSec, getCountdownTime } from "@set/utils/dist/datetime";
import { mdiChevronDoubleRight, mdiCog, mdiInformationOutline, mdiVolumeHigh, mdiVolumeOff } from "@mdi/js";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { TimerSettings, timerSettingsAtom } from "states/timer-states";
import { AppRouterOutputs } from "trpc";
import { trpc } from "trpc-core";
import classNames from "classnames";
import { allowedLatency } from "connection";

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
            className="leading-none transition-all w-full overflow-y-auto"
        >
            <div style={{ padding: "0.1em" }} className="flex overflow-y-auto justify-between">
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
        <div className="p-2 flex items-center" onClick={() => setShowLatency(!showLatency)}>
            <span
                className={classNames("block rounded-full w-4 h-4", {
                    ["bg-orange-500"]: latency > allowedLatency,
                    ["bg-lime-500"]: latency <= allowedLatency,
                })}
            ></span>
            <span className={classNames("ml-2 transition-opacity font-semibold", { ["opacity-0"]: !showLatency })}>{latency}ms</span>
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
            className="leading-none max-w-[30%] transition-all w-full overflow-y-auto"
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

export const Timer = () => {
    const [systemTime, setSystemTime] = useState<{ timeOffset: number; latency: number }>();
    const [globalTime, setGlobalTime] = useState<number>();
    const [clockState, setClockState] = useAtom(timerSettingsAtom);
    const [beep, setBeep] = useState<BeepFunction | undefined>(undefined);
    const { raceId } = useParams() as { raceId: string };

    const { data: players } = trpc.player.startList.useQuery(
        { raceId: Number.parseInt(raceId! as string) },
        { enabled: !!raceId, select: data => sort(data, d => d.absoluteStartTime) }
    );
    const ntpMutation = trpc.ntp.sync.useMutation();

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

        const tickSecondsToPlayer = () => {
            const globalTime = Date.now() + systemTime.timeOffset;
            const globalDateTime = new Date(globalTime);
            const miliseconds = globalDateTime.getMilliseconds();// - clockStartTimeMiliseconds + 1_000;

            if (miliseconds <= clockTimeout) {
                // console.log(offset * 60_000);
                const nextPlayers = players.filter(p => p.absoluteStartTime - globalTime > 0);
                

                const nextPlayer = nextPlayers[0];

                // console.log(new Date(globalTime), new Date(nextPlayer.absoluteStartTime));

                //it will re-render that react tree each second, too often
                // setNextPlayers(nextPlayers.slice(0, clockState.players.count).map(p => p.player));

                const nextPlayerTimeToStart = nextPlayer?.absoluteStartTime - globalTime;

                const secondsToNextStart = Math.floor((nextPlayerTimeToStart || getCountdownTime(globalTime)) / 1_000);

                setNextPlayers(nextPlayers.slice(0, clockState.nextPlayers.count));
                setSecondsToNextPlayer(secondsToNextStart);
                setGlobalTime(globalTime);
            }
        };

        tickSecondsToPlayer();
        const secondsToPlayerInterval = setInterval(tickSecondsToPlayer, clockTimeout);

        return () => {
            clearInterval(secondsToPlayerInterval);
        };
    }, [systemTime, players]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const requestTimeSync = async () => {
            const loadStartTime = Date.now();
            const serverTime: number = await ntpMutation.mutateAsync(loadStartTime);
            const loadEndTime = Date.now();
            const latency = loadEndTime - loadStartTime;

            const timeOffset = -(loadEndTime - Math.floor(serverTime + latency / 2));

            if (systemTime === undefined || latency < systemTime.latency)
                setSystemTime({
                    timeOffset,
                    latency,
                });

            if (latency > allowedLatency) timeout = setTimeout(requestTimeSync, 1000);
        };

        requestTimeSync();

        return () => {
            clearTimeout(timeout);
        };
    }, [systemTime]);

    return (
        <>
            <div className="select-none bg-black h-full w-full text-white relative overflow-hidden">
                {globalTime === undefined || players === undefined ? (
                    <div className="min-w-screen min-h-screen flex font-semibold justify-center items-center">Smarujemy łańcuch...</div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center">
                        <div className="flex w-full justify-between">
                            <div className="flex self-start items-center">
                                <div onClick={toggleMenu} className="cursor-pointer p-4">
                                    <Icon size={1.5} path={mdiCog} />
                                </div>
                                <div onClick={toggleSoundEnabled} className="cursor-pointer p-4">
                                    <Icon size={1.5} path={beep !== undefined ? mdiVolumeHigh : mdiVolumeOff} />
                                </div>
                                {systemTime && <Latency latency={systemTime.latency} />}
                            </div>
                            {clockState.clock.enabled && <Clock fontSize={clockState.clock.size} time={globalTime!} />}
                        </div>

                        <div className="flex w-full flex-grow overflow-y-hidden">
                            <div className="flex flex-grow items-center flex-col">
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