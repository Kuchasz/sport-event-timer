import dynamic from "next/dynamic";
import { AppType } from "next/app";
import { PanelApp } from "../apps/panel";
import { queryClient, trpc } from "../connection";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { TimerApp } from "../apps/timer";
import "../globals.scss";
import type { Session } from "next-auth";
import "react-data-grid/lib/styles.css";
import { ResultApp } from "apps/result";

const StopwatchApp = dynamic(() => import("../apps/stopwatch"), { ssr: false });

const App: AppType<{ session: Session | null }> = ({ Component, pageProps: { session, ...pageProps }, router }) => {
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
        <SessionProvider session={session}>
            <PanelApp Component={Component} pageProps={pageProps} router={router} queryClient={queryClient} trpcClient={trpc} />
        </SessionProvider>
    ) : router.pathname.startsWith("/stopwatch") ? (
        <SessionProvider session={session}>
            <StopwatchApp Component={Component} pageProps={pageProps} router={router} queryClient={queryClient} trpcClient={trpc} />
        </SessionProvider>
    ) : router.pathname.startsWith("/result") ? (
        <ResultApp Component={Component} pageProps={pageProps} router={router} queryClient={queryClient} trpcClient={trpc} />
    ) : (
        <TimerApp Component={Component} pageProps={pageProps} router={router} queryClient={queryClient} trpcClient={trpc} />
    );
};

// const url = process.env.NODE_ENV === "production" ? `https://api.rura.cc` : "http://localhost:3001";

export default trpc.withTRPC(App);

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
