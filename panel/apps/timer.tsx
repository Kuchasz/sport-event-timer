import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

type TimerAppProps = AppProps;

export const TimerApp = ({ Component, pageProps }: TimerAppProps) => {
    const {
        query: { raceId },
    } = useRouter();

    return (
        <>
            <Head>
                <title>Timer</title>
                {raceId && <link key="manifest" rel="manifest" href={`/api/manifest/${raceId}/timer`} />}
            </Head>
            <Component {...pageProps} />
        </>
    );
};
