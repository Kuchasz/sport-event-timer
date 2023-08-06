import { Breadcrumbs } from "components/breadcrumbs";
import { db } from "server/db";

export default async ({ params }: { params: { raceId: string, classificationId: string } }) => {
    const race = await db.race.findFirstOrThrow({ where: { id: Number(params.raceId) } });
    const classification = await db.classification.findFirstOrThrow({ where: { id: Number(params.classificationId) } });

    return (
        <Breadcrumbs>
            <Breadcrumbs.Item text={race.name}></Breadcrumbs.Item>
            <Breadcrumbs.Item text="classifications"></Breadcrumbs.Item>
            <Breadcrumbs.Item text={classification.name}></Breadcrumbs.Item>
            <Breadcrumbs.Item text="categories"></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};
