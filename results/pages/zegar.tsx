import Head from "next/head";
import Icon from "@mdi/react";
import React from "react";
import { Countdown } from "components/countdown";
import { Loader } from "../components/loader";
import {
    mdiCog,
    mdiEyeOffOutline,
    mdiFormatFontSizeDecrease,
    mdiFormatFontSizeIncrease,
    mdiVolumeHigh,
    mdiVolumeOff,
    mdiWindowClose
    } from "@mdi/js";
import { Meta } from "../components/meta";
import { socket } from "../connection";
import { Timer } from "../components/timer";
import { useEffect, useState } from "react";

type TextSettings = {
    enabled: boolean;
    size: number;
};

type ClockSettings = {
    showSettings: boolean;
    clock: TextSettings;
    countdown: TextSettings;
    currentPlayer: TextSettings;
    nextPlayer: TextSettings;
};

type TextActions = {
    enlargeFont: () => void;
    minifyFont: () => void;
    toggle: () => void;
};

const defaultClockSettings: ClockSettings = {
    showSettings: false,
    clock: { enabled: true, size: 6 },
    countdown: { enabled: true, size: 90 },
    currentPlayer: { enabled: true, size: 6 },
    nextPlayer: { enabled: true, size: 3 }
};

const ConfigButton = ({ text, path, click }: { text: string; path: string; click: () => void }) => (
    <span className="flex items-center py-2 cursor-pointer" onClick={click}>
        <div className="bg-orange-500 p-2 rounded-full text-white">
            <Icon size={1} path={path} />
        </div>
        <span className="ml-2">{text}</span>
    </span>
);

const ConfigMenuOption = ({
    actions,
    name,
    showDivider
}: {
    actions: TextActions;
    name: string;
    showDivider: boolean;
}) => (
    <div>
        <div className="flex flex-col p-2">
            {showDivider && (
                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t"></div>
                </div>
            )}
            <span>{name}</span>
            <ConfigButton click={actions.toggle} path={mdiEyeOffOutline} text="Ukryj" />
            <ConfigButton click={actions.enlargeFont} path={mdiFormatFontSizeIncrease} text="Powiększenie czcionki" />
            <ConfigButton click={actions.minifyFont} path={mdiFormatFontSizeDecrease} text="Pomniejszenie czcionki" />
        </div>
    </div>
);

const Zegar = () => {
    const [timeOffset, setTimeOffset] = useState<number>();
    const [clockState, setClockState] = useState<ClockSettings>(defaultClockSettings);
    const [soundEnabled, setSoundEnabled] = useState(false);

    const toggleSoundEnabled = () => setSoundEnabled(!soundEnabled);

    const textActions = (prop: keyof Omit<ClockSettings, "showSettings">, step: number = 1): TextActions => ({
        enlargeFont: () => {
            const textState = clockState[prop];
            setClockState({ ...clockState, [prop]: { ...textState, size: textState.size + step } });
        },
        minifyFont: () => {
            const textState = clockState[prop];
            setClockState({ ...clockState, [prop]: { ...textState, size: textState.size - step } });
        },
        toggle: () => {
            const textState = clockState[prop];
            setClockState({ ...clockState, [prop]: { ...textState, enabled: !textState.enabled } });
        }
    });

    const toggleMenu = () => {
        setClockState({ ...clockState, showSettings: !clockState.showSettings });
    };

    useEffect(() => {
        // const req = new XMLHttpRequest();

        // req.onreadystatechange = (e) => {
        //     console.log(req.readyState);
        //     console.log(e);
        // };

        // let loadStartTime: number;
        // let loadEndTime: number;

        // req.onloadstart = () => {
        //     loadStartTime = Date.now();
        // };
        // req.onloadend = (_) => {
        //     loadEndTime = Date.now();
        //     const latency = loadEndTime - loadStartTime;
        //     const currentServerTime = Number(req.response) + latency / 2;
        //     const offset = loadEndTime - currentServerTime;
        //     console.log("atency", latency, "offset", offset);
        //     setTimeOffset(offset);
        // };

        // req.open("GET", timeSyncUrl);
        // req.send();

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
                        {clockState.currentPlayer.enabled && (
                            <div
                                style={{ fontSize: `${clockState.currentPlayer.size}rem` }}
                                className="leading-none transition-all"
                            >
                                John Doe
                            </div>
                        )}
                        {clockState.nextPlayer.enabled && (
                            <div
                                style={{ fontSize: `${clockState.nextPlayer.size}rem` }}
                                className="leading-none mb-4 transition-all"
                            >
                                Następny: John Doe
                            </div>
                        )}

                        {clockState.showSettings ? (
                            <div className="absolute left-0 top-0 h-full select-none">
                                <div className="w-80 bg-zinc-100 h-full text-zinc-600 overflow-y-auto">
                                    <div className="flex p-2 items-center justify-between bg-orange-500 text-white text-2xl mb-4 font-medium">
                                        Ustawienia
                                        <div onClick={toggleMenu}>
                                            <Icon className="cursor-pointer m-2" size={1} path={mdiWindowClose} />
                                        </div>
                                    </div>
                                    <div>
                                        <ConfigMenuOption
                                            actions={textActions("clock")}
                                            showDivider={false}
                                            name="Zegar"
                                        />
                                        <ConfigMenuOption
                                            actions={textActions("countdown", 6)}
                                            showDivider={true}
                                            name="Stoper"
                                        />
                                        <ConfigMenuOption
                                            actions={textActions("currentPlayer")}
                                            showDivider={true}
                                            name="Aktualny zawodnik"
                                        />
                                        <ConfigMenuOption
                                            actions={textActions("nextPlayer")}
                                            showDivider={true}
                                            name="Następny zawodnik"
                                        />
                                    </div>
                                </div>
                            </div>
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
