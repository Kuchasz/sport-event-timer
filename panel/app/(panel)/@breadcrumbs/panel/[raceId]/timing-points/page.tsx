import { Breadcrumbs } from "components/breadcrumbs";
import { Route } from "next";
import { db } from "server/db";

export default async ({ params }: { params: { raceId: string } }) => {
    const race = await db.race.findFirstOrThrow({ where: { id: Number(params.raceId) } });

    return (
        <Breadcrumbs>
            <Breadcrumbs.Item href={`/panel/${params.raceId}` as Route} text={race.name}></Breadcrumbs.Item>
            <Breadcrumbs.Item href={`/panel/${params.raceId}/timing-points` as Route} text="timing points"></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};
