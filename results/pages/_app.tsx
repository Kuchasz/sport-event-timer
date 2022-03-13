import Layout from "../components/layout";
import SimpleReactLightbox from "simple-react-lightbox";
import { AppProps } from "next/app";
import "../globals.scss";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page);

    return getLayout ? (
        getLayout(<Component {...pageProps} />)
    ) : (
        <Layout>
            <SimpleReactLightbox>
                <Component {...pageProps} />
            </SimpleReactLightbox>
        </Layout>
    );
}
