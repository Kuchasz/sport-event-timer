import { AppProps } from "next/app";
import { CurrentRaceContext } from "current-race-context";

import { useEffect, useState } from "react";

type TimerAppProps = AppProps;

export function TimerApp({ Component, pageProps }: TimerAppProps) {
    const [currentRaceId, setCurrentRaceId] = useState<number | undefined>(undefined);
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", function () {
                navigator.serviceWorker.register("/sw.js").then(
                    function (registration) {
                        console.log("Service Worker registration successful with scope: ", registration.scope);
                    },
                    function (err) {
                        console.log("Service Worker registration failed: ", err);
                    }
                );
            });
        }
    }, []);

    return (
        <CurrentRaceContext.Provider value={{ raceId: currentRaceId, selectRace: setCurrentRaceId }}>
            <Component {...pageProps} />
        </CurrentRaceContext.Provider>
    );
}
