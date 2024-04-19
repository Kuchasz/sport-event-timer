import { getTranslations } from "next-intl/server";
import Head from "next/head";
import { authenticate } from "src/auth";
import { SplitTimes } from "./split-times";

export default async function () {
    await authenticate();
    const t = await getTranslations();

    return (
        <>
            <Head>
                <title>{t("pages.splits.header.title")}</title>
            </Head>
            <SplitTimes />
        </>
    );
}
