import { trpcRSC } from "trpc-core-rsc";
import { RaceStartList } from "./start-list";

export default async function ({ params }: { params: { raceId: string } }) {
    const { raceId } = params;

    const players = await trpcRSC.player.startList.query({ raceId: Number.parseInt(raceId) });

    return <RaceStartList players={players} renderTime={new Date().getTime()} />;
}
