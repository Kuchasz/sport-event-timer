import Layout from "../components/layout";
import superjson from "superjson";
import { AppProps } from "next/app";
import { CurrentRaceContext } from "current-race-context";
import { Demodal } from "demodal";
import { useEffect, useState } from "react";
import { withTRPC } from "@trpc/next";
import "../globals.scss";

import type { AppRouter } from "@set/server/router";

function MyApp({ Component, pageProps }: AppProps) {
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
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <Demodal.Container />
        </CurrentRaceContext.Provider>
    );
}

export default withTRPC<AppRouter>({
    config({ ctx }) {
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         */
        const url = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}/api/trpc`
            : "http://localhost:21822/api/trpc";

        return {
            url,
            transformer: superjson
            /**
             * @link https://react-query.tanstack.com/reference/QueryClient
             */
            // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
        };
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
    ssr: true
})(MyApp);
