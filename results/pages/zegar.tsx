import Head from "next/head";
import React from "react";
import { Countdown } from "components/countdown";
import { Loader } from "../components/loader";
import { socket } from "../connection";
import { Timer } from "../components/timer";
import { useEffect, useState } from "react";
// import { timeSyncUrl } from "../api";
// import { create } from "timesync";
// import { getCurrentTimeOffset, timeSyncUrl } from '../api';

const Zegar = () => {
    const [timeOffset, setTimeOffset] = useState<number>();
    useEffect(() => {
        // const req = new XMLHttpRequest();

        // for (var i = 0; i < 100; i++) {
        //     fetch("https://jsonplaceholder.typicode.com/todos/1");
        // }

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
            <div className="bg-black h-full w-full text-white relative overflow-hidden">
                {timeOffset === undefined ? (
                    <div className="min-w-screen min-h-screen flex font-semibold justify-center items-center">
                        Smarujemy łańcuch...
                        <Loader light={true} />
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col items-center">
                        <Timer offset={timeOffset} />
                        <Countdown offset={timeOffset} />
                        <div className="text-8xl">John Doe</div>
                        <div className="text-4xl mb-4">Następny: John Doe</div>
                    </div>
                )}
            </div>
        </>
    );
};

Zegar.getLayout = () => <Zegar />;

export default Zegar;
