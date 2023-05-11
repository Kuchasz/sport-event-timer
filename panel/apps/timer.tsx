import { AppProps } from "next/app";
import Head from "next/head";

type TimerAppProps = AppProps;

export const TimerApp = ({ Component, pageProps }: TimerAppProps) => (
    <>
        <Head>
            <title>Timer</title>
            <link key="manifest" rel="manifest" href="/favicon/timer.webmanifest" />
        </Head>
        <Component {...pageProps} />
    </>
);
