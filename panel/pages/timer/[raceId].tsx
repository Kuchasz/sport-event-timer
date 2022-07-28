import Head from "next/head";
import Icon from "@mdi/react";
import React from "react";
import { BeepFunction, createBeep } from "@set/shared/dist/beep";
import { Clock } from "../../components/clock";
import { ConfigMenu } from "../../components/config-menu";
import { Countdown } from "components/countdown";
import { getCountdownTime, sort, unreliablyGetIsMobile } from "@set/shared/dist";
import { InferQueryOutput, trpc } from "trpc";
import {
    mdiChevronDoubleRight,
    mdiCog,
    mdiVolumeHigh,
    mdiVolumeOff
    } from "@mdi/js";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type StartListPlayer = InferQueryOutput<"player.start-list">[0];

export type TextSettings = {
    enabled: boolean;
    size: number;
};

export type TimerSettings = {
    showSettings: boolean;
    clock: TextSettings;
    countdown: TextSettings;
    players: TextSettings & { count: number };
};

export type TextActions = {
    enlargeFont: () => void;
    minifyFont: () => void;
    toggle: () => void;
};

const clockTimeout = 100;

export const defaultTimerSettings: TimerSettings = unreliablyGetIsMobile()
    ? {
          showSettings: false,
          clock: { enabled: true, size: 6 },
          countdown: { enabled: true, size: 40 },
          players: { enabled: true, size: 14, count: 3 }
      }
    : {
          showSettings: false,
          clock: { enabled: true, size: 6 },
          countdown: { enabled: true, size: 90 },
          players: { enabled: true, size: 24, count: 3 }
      };

const NextPlayers = ({ player }: { player: StartListPlayer }) => (
    <span className="flex items-center first:text-orange-500 first:font-semibold" style={{ marginInline: "0.25em" }}>
        <Icon size="2em" path={mdiChevronDoubleRight} />
        <div
            style={{
                paddingInline: "0.25em",
                paddingBlock: "0.1em"
            }}
        >
            {player.bibNumber}
        </div>
        {player.name} {player.lastName}
    </span>
);

const Timer = () => {
    const [globalTimeOffset, setGlobalTimeOffset] = useState<number>();
    const [globalTime, setGlobalTime] = useState<number>();
    const [clockState, setClockState] = useState<TimerSettings>(defaultTimerSettings);
    const [beep, setBeep] = useState<BeepFunction | undefined>(undefined);
    const { raceId } = useRouter().query;

    const { data: players } = trpc.useQuery(["player.start-list", { raceId: Number.parseInt(raceId! as string) }]);
    const ntpMutation = trpc.useMutation(["ntp.sync"]);

    // const [players, setPlayers] = useState<ClockListPlayer[]>([]);
    const [nextPlayers, setNextPlayers] = useState<StartListPlayer[]>([]);
    const [secondsToNextPlayer, setSecondsToNextPlayer] = useState<number>(0);

    const toggleSoundEnabled = () => {
        setBeep(beep ? undefined : createBeep);
    };

    const toggleMenu = () => {
        setClockState({ ...clockState, showSettings: !clockState.showSettings });
    };

    useEffect(() => {
        if (globalTimeOffset === undefined || players === undefined) return;
        const clockStartTimeLatency = new Date().getMilliseconds();
        const secondsToPlayerInterval = setInterval(() => {
            const globalTime = Date.now() + globalTimeOffset;
            const globalDateTime = new Date(globalTime);
            const miliseconds = globalDateTime.getMilliseconds() - clockStartTimeLatency;

            if (miliseconds <= clockTimeout) {
                const playersWithPosiviteTimeToStart = players
                    .map(p => ({ player: p, timeToStart: p.absoluteStartTime - globalTime }))
                    .filter(p => p.timeToStart > 0);

                const nextPlayers = sort(playersWithPosiviteTimeToStart, p => p.timeToStart);
                const nextPlayer = nextPlayers[0];

                //it will re-render that react tree each second, too often
                setNextPlayers(nextPlayers.slice(0, clockState.players.count).map(p => p.player));

                const secondsToNextStart = Math.floor(
                    (nextPlayer?.timeToStart || getCountdownTime(globalTime)) / 1_000
                );

                setSecondsToNextPlayer(secondsToNextStart);
                setGlobalTime(globalTime);
            }
        }, clockTimeout);

        return () => {
            clearInterval(secondsToPlayerInterval);
        };
    }, [globalTimeOffset, players]);

    useEffect(() => {
        let loadStartTime = Date.now();

        const requestTimeSync = async () => {
            const serverTime: number = await ntpMutation.mutateAsync(loadStartTime);
            const loadEndTime = Date.now();
            const latency = loadEndTime - loadStartTime;

            const timeOffset = -(loadEndTime - (serverTime + latency / 2));

            setGlobalTimeOffset(timeOffset);

            if (latency <= 50) {
                clearInterval(timeSyncInterval);
            }
        };

        const timeSyncInterval = setInterval(() => {
            loadStartTime = Date.now();
            requestTimeSync();
        }, 1000);

        return () => {
            clearInterval(timeSyncInterval);
        };
    }, []);

    return (
        <>
            <Head>
                <title>Timer</title>
                <link key="manifest" rel="manifest" href="/favicon/clock.webmanifest" />
            </Head>
            <div className="select-none bg-black h-full w-full text-white relative overflow-hidden">
                {globalTime === undefined ? (
                    <div className="min-w-screen min-h-screen flex font-semibold justify-center items-center">
                        Smarujemy łańcuch...
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center">
                        {clockState.clock.enabled && <Clock fontSize={clockState.clock.size} time={globalTime!} />}
                        {clockState.countdown.enabled && (
                            <Countdown beep={beep} fontSize={clockState.countdown.size} seconds={secondsToNextPlayer} />
                        )}
                        {clockState.players.enabled && (
                            <div
                                style={{ fontSize: `${clockState.players.size}px` }}
                                className="leading-none transition-all w-full"
                            >
                                <div style={{ padding: "0.1em" }} className="flex justify-between">
                                    {nextPlayers.map(p => (
                                        <NextPlayers key={p.bibNumber} player={p} />
                                    ))}
                                </div>
                            </div>
                        )}
                        {clockState.showSettings ? (
                            <ConfigMenu clockState={clockState} toggleMenu={toggleMenu} setClockState={setClockState} />
                        ) : (
                            <div onClick={toggleMenu} className="cursor-pointer absolute top-0 left-0 p-4">
                                <Icon size={2} path={mdiCog} />
                            </div>
                        )}
                        <div onClick={toggleSoundEnabled} className="cursor-pointer absolute top-0 right-0 p-4">
                            <Icon size={2} path={beep !== undefined ? mdiVolumeHigh : mdiVolumeOff} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Timer;
