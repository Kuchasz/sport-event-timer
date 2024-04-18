import { getTranslations } from "next-intl/server";
import Head from "next/head";
import { authenticate } from "src/auth";
import { PageHeader } from "src/components/page-headers";
import { SidePage } from "src/components/pages";
import { Classifications } from "../../../../../components/classifications";
import { trpcRSC } from "src/trpc-core-rsc";

const SplitsGreeting = async () => {
    const t = await getTranslations();
    return (
        <div className="border-1 flex h-full border-solid border-gray-600">
            <div>
                <PageHeader title={t("pages.splits.header.title")} description={t("pages.splits.header.description")} />
            </div>
        </div>
    );
};

export default async function ({ params: { raceId } }: { params: { raceId: string } }) {
    await authenticate();
    const t = await getTranslations();

    const classifications = await trpcRSC.classification.classifications.query({ raceId: Number(raceId) });

    return (
        <>
            <Head>
                <title>{t("pages.splits.header.title")}</title>
            </Head>
            <SidePage side={<Classifications classifications={classifications} raceId={raceId} />} content={<SplitsGreeting />}></SidePage>
        </>
    );
}
