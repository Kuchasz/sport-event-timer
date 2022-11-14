import Layout from "../components/layout";
import { AppProps } from "next/app";
import { CurrentRaceContext } from "current-race-context";
import { Demodal } from "demodal";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type PanelAppProps = AppProps & { queryClient: QueryClient };

export function PanelApp({ Component, pageProps, queryClient }: PanelAppProps) {
    const [currentRaceId, setCurrentRaceId] = useState<number | undefined>(undefined);

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
