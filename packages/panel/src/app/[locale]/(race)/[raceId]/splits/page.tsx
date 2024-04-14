import { authenticate } from "src/auth";
import Head from "next/head";
import { PageHeader, SectionHeader } from "src/components/page-headers";
import { getTranslations } from "next-intl/server";

export default async function () {
    await authenticate();

    const t = await getTranslations();

    return (
        <>
            <Head>
                <title>{t("pages.timingPoints.header.title")}</title>
            </Head>
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
        </>
    );
}
