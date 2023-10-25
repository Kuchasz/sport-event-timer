import { Breadcrumbs } from "components/breadcrumbs";
import { useTranslations } from "next-intl";
import { db } from "server/db";

const CategoriesBreadcrumbs = ({ raceId, classificationName }: { raceId: string; classificationName: string }) => {
    const t = useTranslations();

    return (
        <Breadcrumbs homePath={`/${raceId}`}>
            <Breadcrumbs.Item href={`/${raceId}/classifications`} text={t("pages.classifications.header.title")}></Breadcrumbs.Item>
            <Breadcrumbs.Item text={classificationName}></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};

export default async ({ params }: { params: { raceId: string; classificationId: string } }) => {
    const classification = await db.classification.findFirstOrThrow({ where: { id: Number(params.classificationId) } });

    return <CategoriesBreadcrumbs raceId={params.raceId} classificationName={classification.name} />;
};
