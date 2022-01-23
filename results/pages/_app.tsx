import Layout from "../components/layout";
import SimpleReactLightbox from "simple-react-lightbox";
import { AppProps } from "next/app";
import "../globals.scss";

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Layout>
            <SimpleReactLightbox>
                <Component {...pageProps} />
            </SimpleReactLightbox>
        </Layout>
    );
}
