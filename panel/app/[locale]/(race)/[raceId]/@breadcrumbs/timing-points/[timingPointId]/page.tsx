import { Breadcrumbs } from "components/breadcrumbs";
import { useTranslations } from "next-intl";
import { db } from "server/db";

const TimingPointBreadcrumbs = ({ raceId, timingPointName }: { raceId: string; timingPointName: string }) => {
    const t = useTranslations();

    return (
        <Breadcrumbs homePath={`/${raceId}`}>
            <Breadcrumbs.Item href={`/${raceId}/timing-points`} text={t("pages.timingPoints.header.title")}></Breadcrumbs.Item>
            <Breadcrumbs.Item text={timingPointName}></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};

export default async ({ params }: { params: { raceId: string; timingPointId: string } }) => {
    const timingPoint = await db.timingPoint.findFirstOrThrow({
        where: { raceId: Number(params.raceId), id: Number(params.timingPointId) },
    });

    return <TimingPointBreadcrumbs raceId={params.raceId} timingPointName={timingPoint.name} />;
};
