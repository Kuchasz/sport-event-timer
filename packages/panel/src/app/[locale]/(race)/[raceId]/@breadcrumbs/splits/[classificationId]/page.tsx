import { Breadcrumbs } from "src/components/breadcrumbs";
import { useTranslations } from "next-intl";
import { db } from "src/server/db";

const SplitsListBreadcrumbs = ({ raceId, classificationName }: { raceId: string; classificationName: string }) => {
    const t = useTranslations();

    return (
        <Breadcrumbs homePath={`/${raceId}`}>
            <Breadcrumbs.Item href={`/${raceId}/splits`} text={t("pages.splits.header.title")}></Breadcrumbs.Item>
            {classificationName && <Breadcrumbs.Item text={classificationName}></Breadcrumbs.Item>}
        </Breadcrumbs>
    );
};

export default async ({ params }: { params: { raceId: string; classificationId: string } }) => {
    const classification = await db.classification.findFirstOrThrow({
        where: { raceId: Number(params.raceId), id: Number(params.classificationId) },
    });

    return <SplitsListBreadcrumbs raceId={params.raceId} classificationName={classification.name} />;
};
