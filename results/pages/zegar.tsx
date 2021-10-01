import Head from "next/head";
import Layout from "../components/layout";
import React from "react";
import { Countdown } from "components/countdown";
import { FullscreenBackground } from "../components/fullscreen-background";
import { getCurrentTimeOffset } from "../api";
import { Loader } from "../components/loader";
import { Timer } from "../components/timer";
import { useEffect, useState } from "react";

const Zegar = () => {
    const [timeOffset, setTimeOffset] = useState<number>();
    useEffect(() => {
        getCurrentTimeOffset().then(setTimeOffset);
    }, []);
    return (
        <Layout>
            <Head>
                <title>Zegar</title>
            </Head>
            <div className="h-full w-full relative overflow-hidden">
                <FullscreenBackground />
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
        </Layout>
    );
};

export default Zegar;
