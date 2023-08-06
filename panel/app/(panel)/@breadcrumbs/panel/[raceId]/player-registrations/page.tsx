import { Breadcrumbs } from "components/breadcrumbs";
import { db } from "server/db";

export default async ({ params }: { params: { raceId: string } }) => {
    const race = await db.race.findFirstOrThrow({ where: { id: Number(params.raceId) } });

    return (
        <Breadcrumbs>
            <Breadcrumbs.Item text={race.name}></Breadcrumbs.Item>
            <Breadcrumbs.Item text="player registrations"></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};
