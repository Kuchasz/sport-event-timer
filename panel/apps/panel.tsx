import Layout from "../components/layout";
import { AppProps } from "next/app";
import { CurrentRaceContext } from "current-race-context";
import { Demodal } from "demodal";
import { useState } from "react";

type PanelAppProps = AppProps;

export function PanelApp({ Component, pageProps }: PanelAppProps) {
    const [currentRaceId, setCurrentRaceId] = useState<number | undefined>(undefined);

    return (
            <CurrentRaceContext.Provider value={{ raceId: currentRaceId, selectRace: setCurrentRaceId }}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
                <Demodal.Container />
            </CurrentRaceContext.Provider>
    );
}
