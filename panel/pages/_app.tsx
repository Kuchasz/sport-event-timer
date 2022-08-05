import Layout from "../components/layout";
import superjson from "superjson";
import { AppProps } from "next/app";
import { CurrentRaceContext } from "current-race-context";
import { Demodal } from "demodal";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { PanelApp } from "./_panel";
import { queryClient, trpcClient } from "../connection";
import { StopwatchApp } from "./_stopwatch";
import { useEffect, useState } from "react";
import { withTRPC } from "@trpc/next";
import "../globals.scss";

import type { AppRouter } from "@set/server/router";

const noLayoutPages = ["/timer/[raceId]"];

function MyApp({ Component, pageProps, router }: AppProps) {
    // const [currentRaceId, setCurrentRaceId] = useState<number | undefined>(undefined);
    console.log(router.pathname);
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

    return router.pathname.startsWith("/panel") ? (
        <PanelApp
            Component={Component}
            pageProps={pageProps}
            router={router}
            queryClient={queryClient}
            trpcClient={trpcClient}
        />
    ) : router.pathname.startsWith("/stopwatch") ? (
        <StopwatchApp
            Component={Component}
            pageProps={pageProps}
            router={router}
            queryClient={queryClient}
            trpcClient={trpcClient}
        />
    ) : (
        <Component {...pageProps} />
    );

    // return noLayoutPages.includes(router.pathname) ? (
    //     <Component {...pageProps} />
    // ) : (
    //     <CurrentRaceContext.Provider value={{ raceId: currentRaceId, selectRace: setCurrentRaceId }}>
    //         <Layout>
    //             <Component {...pageProps} />
    //             <Demodal.Container />
    //         </Layout>
    //     </CurrentRaceContext.Provider>
    // );
}

const url =
    process.env.NODE_ENV === "production" ? `http://20.234.101.215:21822/api/trpc` : "http://localhost:21822/api/trpc";

export default MyApp;

// export default withTRPC<AppRouter>({
//     config() {
//         /**
//          * If you want to use SSR, you need to use the server's full URL
//          * @link https://trpc.io/docs/ssr
//          */

//         return {
//             transformer: superjson,
//             links: [
//                 loggerLink({
//                     enabled: opts =>
//                         (process.env.NODE_ENV === "development" && typeof window !== "undefined") ||
//                         (opts.direction === "down" && opts.result instanceof Error)
//                 }),
//                 // getWSLink(),
//                 httpBatchLink({ url })
//             ]
//             /**
//              * @link https://react-query.tanstack.com/reference/QueryClient
//              */
//             // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
//         };
//     },
//     /**
//      * @link https://trpc.io/docs/ssr
//      */
//     ssr: true
// })(MyApp);
