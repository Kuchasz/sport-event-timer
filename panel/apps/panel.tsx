import Layout from "../components/layout";
import { AppProps } from "next/app";
import { Demodal } from "demodal";

type PanelAppProps = AppProps;

export function PanelApp({ Component, pageProps }: PanelAppProps) {
    return (
        <>
            <Layout>
                <Component {...pageProps} />
            </Layout>
            <Demodal.Container />
        </>
    );
}
