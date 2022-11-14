import Layout from "../components/layout";
import { AppProps } from "next/app";
import { CurrentRaceContext } from "current-race-context";
import { Demodal } from "demodal";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type PanelAppProps = AppProps & { queryClient: QueryClient };

export function PanelApp({ Component, pageProps, queryClient }: PanelAppProps) {
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
        <QueryClientProvider client={queryClient}>
            <CurrentRaceContext.Provider value={{ raceId: currentRaceId, selectRace: setCurrentRaceId }}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
                <Demodal.Container />
            </CurrentRaceContext.Provider>
        </QueryClientProvider>
    );
}
