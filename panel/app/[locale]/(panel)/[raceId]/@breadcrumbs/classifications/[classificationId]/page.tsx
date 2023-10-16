import { Breadcrumbs } from "components/breadcrumbs";
import { useTranslations } from "next-intl";
import { db } from "server/db";

const CategoriesBreadcrumbs = ({ raceId, classificationName, raceName }: { raceId: string; classificationName: string; raceName: string }) => {
    const t = useTranslations();

    return (
        <Breadcrumbs>
            <Breadcrumbs.Item href={`/${raceId}`} text={raceName}></Breadcrumbs.Item>
            <Breadcrumbs.Item href={`/${raceId}/classifications`} text={t('pages.classifications.header.title')}></Breadcrumbs.Item>
            <Breadcrumbs.Item text={classificationName}></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};

export default async ({ params }: { params: { raceId: string, classificationId: string } }) => {
    const race = await db.race.findFirstOrThrow({ where: { id: Number(params.raceId) } });
    const classification = await db.classification.findFirstOrThrow({ where: { id: Number(params.classificationId) } });

    return (
        <CategoriesBreadcrumbs raceId={params.raceId} raceName={race.name} classificationName={classification.name}/>
    );
};
