import { getTranslations } from "next-intl/server";
import Head from "next/head";
import { authenticate } from "src/auth";
import { PageHeader, SectionHeader } from "src/components/page-headers";
import { PageWithSide } from "src/components/pages";
import { Classifications } from "./classifications";

const SplitsGreeting = async () => {
    const t = await getTranslations();
    return (
        <div className="border-1 flex h-full border-solid border-gray-600">
            <div>
                <PageHeader title={t("pages.timingPoints.header.title")} description={t("pages.timingPoints.header.description")} />
                <div className="py-8">
                    <SectionHeader
                        title={t("pages.timingPoints.sections.order.header.title")}
                        description={t("pages.timingPoints.sections.order.header.description")}
                    />
                </div>
            </div>
        </div>
    );
};

export default async function ({ params: { raceId } }: { params: { raceId: string } }) {
    await authenticate();
    const t = await getTranslations();
    return (
        <>
            <Head>
                <title>{t("pages.timingPoints.header.title")}</title>
            </Head>
            <PageWithSide side={<Classifications raceId={raceId} />} content={<SplitsGreeting />}></PageWithSide>
        </>
    );
}
