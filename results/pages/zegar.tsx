import Head from "next/head";
import React from "react";
import { Countdown } from "components/countdown";
import { create } from "timesync";
import { Loader } from "../components/loader";
import { Timer } from "../components/timer";
import { timeSyncUrl } from "../api";
import { useEffect, useState } from "react";
// import { getCurrentTimeOffset, timeSyncUrl } from '../api';

const Zegar = () => {
    const [timeOffset, setTimeOffset] = useState<number>();
    useEffect(() => {
        const ts = create({ server: timeSyncUrl, interval: 5000, delay: 5000 });

        // ts.sync();
        // let synced = false;

        ts.on("sync", (e) => {
            if (e === "end") {
                setTimeOffset(Date.now() - ts.now());
                // synced = true;
            }
        });

        // setInterval(() => {
        //     setTimeOffset(Date.now() - ts.now());
        // }, 5000);

        // setInterval(() => setTimeOffset(ts.now()), 5000);
        // console.log();
        // getCurrentTimeOffset().then(setTimeOffset);
        // setTimeout(() => getCurrentTimeOffset().then(setTimeOffset), 5000);
    }, []);
    return (
        <>
            <Head>
                <title>Zegar</title>
            </Head>
            <div className="bg-zinc-300 h-full w-full relative overflow-hidden">
                {timeOffset === undefined ? (
                    <div className="min-w-screen min-h-screen flex text-white font-semibold justify-center items-center">
                        Smarujemy łańcuch...
                        <Loader light={true} />
                    </div>
                ) : (
                    <div className="w-full h-full filter drop-shadow-3xl flex items-center justify-center">
                        <Timer offset={timeOffset} />

                        <Countdown offset={timeOffset} />
                    </div>
                )}
            </div>
        </>
    );
};

Zegar.getLayout = () => <Zegar />;

export default Zegar;
