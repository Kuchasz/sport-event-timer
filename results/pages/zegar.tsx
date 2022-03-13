import Head from "next/head";
import React from "react";
import { Countdown } from "components/countdown";
import { getCurrentTimeOffset } from "../api";
import { Loader } from "../components/loader";
import { Timer } from "../components/timer";
import { useEffect, useState } from "react";

const Zegar = () => {
    const [timeOffset, setTimeOffset] = useState<number>();
    useEffect(() => {
        getCurrentTimeOffset().then(setTimeOffset);

        setTimeout(() => getCurrentTimeOffset().then(setTimeOffset), 5000);
    }, []);
    return (
        <>
            <Head>
                <title>Zegar</title>
            </Head>
            <div className="bg-gray-300 h-full w-full relative overflow-hidden">
                {timeOffset === undefined ? (
                    <div className="min-w-screen min-h-screen flex text-white font-semibold justify-center items-center">
                        Smarujemy łańcuch...
                        <Loader light={true} />
                    </div>
                ) : (
                    <div className="h-full filter drop-shadow-3xl w-full flex items-center justify-center">
                        <Timer offset={timeOffset} />
                        <div>
                            <Countdown offset={timeOffset} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

Zegar.getLayout = () => <Zegar />;

export default Zegar;
