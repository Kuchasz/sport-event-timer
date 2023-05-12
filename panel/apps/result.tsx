import { AppProps } from "next/app";

type ResultAppProps = AppProps;

export function ResultApp({ Component, pageProps }: ResultAppProps) {
    return <Component {...pageProps} />;
}