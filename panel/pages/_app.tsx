import dynamic from "next/dynamic";
import { AppProps } from "next/app";
import { PanelApp } from "../apps/panel";
import { queryClient, trpcClient } from "../connection";
import { useEffect} from "react";
import { TimerApp } from "../apps/timer";
import "../globals.scss";

const StopwatchApp = dynamic(() => import("../apps/stopwatch"), { ssr: false });

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

    console.log(router.pathname)

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
        <TimerApp
            Component={Component}
            pageProps={pageProps}
            router={router}
            queryClient={queryClient}
            trpcClient={trpcClient}
        />
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
