import { AppProps } from "next/app";

type RegistrationAppProps = AppProps;

export function RegistrationApp({ Component, pageProps }: RegistrationAppProps) {
    return <Component {...pageProps} />;
}