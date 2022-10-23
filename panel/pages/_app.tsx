import dynamic from "next/dynamic";
import { AppType } from "next/app";
import { PanelApp } from "../apps/panel";
import { queryClient, trpcClient, trpcNext } from "../connection";
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
            <PanelApp Component={Component} pageProps={pageProps} router={router} queryClient={queryClient as any} trpcClient={trpcClient} />
        </SessionProvider>
    ) : router.pathname.startsWith("/stopwatch") ? (
        <SessionProvider session={session}>
            <StopwatchApp Component={Component} pageProps={pageProps} router={router} queryClient={queryClient as any} trpcClient={trpcClient} />
        </SessionProvider>
    ) : router.pathname.startsWith("/result") ? (
        <ResultApp Component={Component} pageProps={pageProps} router={router} queryClient={queryClient as any} trpcClient={trpcClient} />
    ) : (
        <TimerApp Component={Component} pageProps={pageProps} router={router} queryClient={queryClient as any} trpcClient={trpcClient} />
    );
};

export default trpcNext.withTRPC(App);