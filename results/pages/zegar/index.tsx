import Head from "next/head";
import Icon from "@mdi/react";
import React from "react";
import { ConfigMenu } from "./config-menu";
import { Countdown } from "components/countdown";
import { Loader } from "../../components/loader";
import {
    mdiChevronDoubleRight,
    mdiCog,
    mdiEyeOffOutline,
    mdiFormatFontSizeDecrease,
    mdiFormatFontSizeIncrease,
    mdiVolumeHigh,
    mdiVolumeOff,
    mdiWindowClose
    } from "@mdi/js";
import { Meta } from "../../components/meta";
import { socket } from "../../connection";
import { Timer } from "../../components/timer";
import { useEffect, useState } from "react";

export type TextSettings = {
    enabled: boolean;
    size: number;
};

export type ClockSettings = {
    showSettings: boolean;
    clock: TextSettings;
    countdown: TextSettings;
    players: TextSettings;
};

export type TextActions = {
    enlargeFont: () => void;
    minifyFont: () => void;
    toggle: () => void;
};

export const defaultClockSettings: ClockSettings = {
    showSettings: false,
    clock: { enabled: true, size: 6 },
    countdown: { enabled: true, size: 90 },
    players: { enabled: true, size: 24 }
};

const NextPlayer = ({ player }: { player: { number: number; name: string } }) => (
    <span className="flex items-center first:text-orange-500 first:font-semibold" style={{ marginInline: "0.25em" }}>
        <Icon size="2em" path={mdiChevronDoubleRight} />
        <div
            style={{
                paddingInline: "0.25em",
                paddingBlock: "0.1em"
            }}
        >
            {player.number}
        </div>
        {player.name}
    </span>
);

const Zegar = () => {
    const [timeOffset, setTimeOffset] = useState<number>();
    const [clockState, setClockState] = useState<ClockSettings>(defaultClockSettings);
    const [soundEnabled, setSoundEnabled] = useState(false);

    const toggleSoundEnabled = () => setSoundEnabled(!soundEnabled);

    const toggleMenu = () => {
        setClockState({ ...clockState, showSettings: !clockState.showSettings });
    };

    useEffect(() => {
        let loadStartTime = Date.now();
        socket.on("TR", (serverTime) => {
            const loadEndTime = Date.now();
            const latency = loadEndTime - loadStartTime;
            console.log("latency", latency);

            setTimeOffset(-(loadEndTime - (serverTime + latency / 2)));
            if (latency <= 50) {
                clearInterval(interval);
                socket.close();
            }
        });

        const interval = setInterval(() => {
            loadStartTime = Date.now();
            socket.emit("TQ");
        }, 1000);
    }, []);
    return (
        <>
            <Head>
                <title>Zegar</title>
            </Head>
            <div className="select-none bg-black h-full w-full text-white relative overflow-hidden">
                {timeOffset === undefined ? (
                    <div className="min-w-screen min-h-screen flex font-semibold justify-center items-center">
                        Smarujemy łańcuch...
                        <Loader light={true} />
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center">
                        {clockState.clock.enabled && <Timer fontSize={clockState.clock.size} offset={timeOffset} />}
                        {clockState.countdown.enabled && (
                            <Countdown
                                soundEnabled={soundEnabled}
                                fontSize={clockState.countdown.size}
                                offset={timeOffset}
                            />
                        )}
                        {clockState.players.enabled && (
                            <div
                                style={{ fontSize: `${clockState.players.size}px` }}
                                className="leading-none transition-all w-full"
                            >
                                <div style={{ padding: "0.1em" }} className="flex justify-between">
                                    {[
                                        { number: 6, name: "Jacek Kowalczyk" },
                                        { number: 71, name: "Monika Tralala" },
                                        { number: 118, name: "Roman Romanowowić" }
                                    ].map((p) => (
                                        <NextPlayer key={p.number} player={p} />
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
                            <Icon size={2} path={soundEnabled ? mdiVolumeHigh : mdiVolumeOff} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

Zegar.getLayout = () => (
    <>
        <Meta />
        <Zegar />
    </>
);

export default Zegar;
