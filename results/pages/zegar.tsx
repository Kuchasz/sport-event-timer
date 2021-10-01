import React from "react";
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
        <div className="h-full w-full">
            <FullscreenBackground />
            {timeOffset === undefined ? (
                <div className="min-w-screen min-h-screen flex justify-center items-center">
                    Smarujemy łańcuch...
                    <Loader />
                </div>
            ) : (
                <div className="h-full w-full flex items-center justify-center">
                    <Timer offset={timeOffset} />
                </div>
            )}
        </div>
    );
};

export default Zegar;
