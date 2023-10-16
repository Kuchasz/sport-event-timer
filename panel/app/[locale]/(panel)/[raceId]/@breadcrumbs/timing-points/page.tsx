import { Breadcrumbs } from "components/breadcrumbs";
import { useTranslations } from "next-intl";
import { db } from "server/db";

const TimingPointsBreadcrumbs = ({ raceId, name }: { raceId: string; name: string }) => {
    const t = useTranslations();

    return (
        <Breadcrumbs>
            <Breadcrumbs.Item href={`/${raceId}`} text={name}></Breadcrumbs.Item>
            <Breadcrumbs.Item text={t("pages.timingPoints.header.title")}></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};

export default async ({ params }: { params: { raceId: string } }) => {
    const race = await db.race.findFirstOrThrow({ where: { id: Number(params.raceId) } });

    return <TimingPointsBreadcrumbs raceId={params.raceId} name={race.name} />;
};
