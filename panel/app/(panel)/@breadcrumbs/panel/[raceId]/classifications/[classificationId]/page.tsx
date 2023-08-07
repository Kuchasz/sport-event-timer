import { Breadcrumbs } from "components/breadcrumbs";
import { db } from "server/db";

export default async ({ params }: { params: { raceId: string, classificationId: string } }) => {
    const race = await db.race.findFirstOrThrow({ where: { id: Number(params.raceId) } });
    const classification = await db.classification.findFirstOrThrow({ where: { id: Number(params.classificationId) } });

    return (
        <Breadcrumbs>
            <Breadcrumbs.Item href={`/panel/${params.raceId}`} text={race.name}></Breadcrumbs.Item>
            <Breadcrumbs.Item href={`/panel/${params.raceId}/classifications`} text="classifications"></Breadcrumbs.Item>
            <Breadcrumbs.Item href={`/panel/${params.raceId}/classifications/${params.classificationId}`} text={classification.name}></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};
