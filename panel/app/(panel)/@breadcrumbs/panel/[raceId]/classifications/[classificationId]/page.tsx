import { Breadcrumbs } from "components/breadcrumbs";
import { Route } from "next";
import { db } from "server/db";

export default async ({ params }: { params: { raceId: string, classificationId: string } }) => {
    const race = await db.race.findFirstOrThrow({ where: { id: Number(params.raceId) } });
    const classification = await db.classification.findFirstOrThrow({ where: { id: Number(params.classificationId) } });

    return (
        <Breadcrumbs>
            <Breadcrumbs.Item href={`/panel/${params.raceId}` as Route} text={race.name}></Breadcrumbs.Item>
            <Breadcrumbs.Item href={`/panel/${params.raceId}/classifications` as Route} text="classifications"></Breadcrumbs.Item>
            <Breadcrumbs.Item href={`/panel/${params.raceId}/classifications/${params.classificationId}` as Route} text={classification.name}></Breadcrumbs.Item>
            <Breadcrumbs.Item href={`/panel/${params.raceId}/classifications/${params.classificationId}` as Route} text="categories"></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};
