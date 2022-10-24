import { AppProps } from "next/app";
import { CurrentRaceContext } from "current-race-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useEffect, useState } from "react";
import { trpc } from "connection";

type TimerAppProps = AppProps & { queryClient: QueryClient; trpcClient: any };

export function TimerApp({ Component, pageProps, queryClient, trpcClient }: TimerAppProps) {
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
        // <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <CurrentRaceContext.Provider value={{ raceId: currentRaceId, selectRace: setCurrentRaceId }}>
                    <Component {...pageProps} />
                </CurrentRaceContext.Provider>
            </QueryClientProvider>
        // </trpc.Provider>
    );
}
