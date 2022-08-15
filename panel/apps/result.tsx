import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpc } from "../trpc";
import { useEffect } from "react";

type ResultAppProps = AppProps & { queryClient: QueryClient; trpcClient: any };

export function ResultApp({ Component, pageProps, queryClient, trpcClient }: ResultAppProps) {
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
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </trpc.Provider>
    );
}
