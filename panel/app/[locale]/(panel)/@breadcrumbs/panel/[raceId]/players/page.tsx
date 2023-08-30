import { Breadcrumbs } from "components/breadcrumbs";
import { db } from "server/db";

export default async ({ params }: { params: { raceId: string } }) => {
    const race = await db.race.findFirstOrThrow({ where: { id: Number(params.raceId) } });

    return (
        <Breadcrumbs>
            <Breadcrumbs.Item href={`/panel/${params.raceId}`} text={race.name}></Breadcrumbs.Item>
            <Breadcrumbs.Item text="players"></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};
