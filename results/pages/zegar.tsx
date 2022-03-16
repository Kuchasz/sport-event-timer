import Head from "next/head";
import React from "react";
import { Countdown } from "components/countdown";
import { Loader } from "../components/loader";
import { Timer } from "../components/timer";
import { timeSyncUrl } from "../api";
import { useEffect, useState } from "react";
// import { create } from "timesync";
// import { getCurrentTimeOffset, timeSyncUrl } from '../api';

const Zegar = () => {
    const [timeOffset, setTimeOffset] = useState<number>();
    useEffect(() => {
        const req = new XMLHttpRequest();

        // for (var i = 0; i < 100; i++) {
        //     fetch("https://jsonplaceholder.typicode.com/todos/1");
        // }

        req.onreadystatechange = (e) => {
            console.log(req.readyState);
            console.log(e);
        };

        let loadStartTime: number;
        let loadEndTime: number;

        req.onloadstart = () => {
            loadStartTime = Date.now();
        };
        req.onloadend = (_) => {
            loadEndTime = Date.now();

            const currentServerTime = Number(req.response) + (loadEndTime - loadStartTime) / 2;
            const offset = loadEndTime - currentServerTime;
            console.log(offset);
            setTimeOffset(offset);
        };

        req.open("GET", timeSyncUrl);
        req.send();

        // console.log("create!");
        // const ts = create({ server: timeSyncUrl, interval: 5000, delay: 5000 });

        // let previousTimeOffset = Date.now();
        // ts.sync();
        // let synced = false;

        // ts.on("sync", (e) => {
        //     if (e === "end") {
        //         const offset = Math.abs(Date.now() - ts.now());
        //         if (offset < previousTimeOffset) {
        //             console.log(offset);
        //             previousTimeOffset = offset;
        //             setTimeOffset(offset);
        //         }

        //         if (offset < 100) {
        //             console.log("destroy!");
        //             ts.destroy();
        //         }

        //         // synced = true;
        //     }
        // });

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
