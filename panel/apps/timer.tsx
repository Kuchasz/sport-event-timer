import { AppProps } from "next/app";
import { useEffect } from "react";

type TimerAppProps = AppProps;

export function TimerApp({ Component, pageProps }: TimerAppProps) {
    useEffect(() => {
        // if ("serviceWorker" in navigator) {
        //     window.addEventListener("load", function () {
        //         navigator.serviceWorker.register("/sw.js").then(
        //             function (registration) {
        //                 console.log("Service Worker registration successful with scope: ", registration.scope);
        //             },
        //             function (err) {
        //                 console.log("Service Worker registration failed: ", err);
        //             }
        //         );
        //     });
        // }
    }, []);

    return <Component {...pageProps} />;
}
