import { trpcRSC } from "trpc-core-rsc";
import { RaceStartList } from "./start-list";
import { Task } from "@set/utils/dist/task";
import { notFound } from "next/navigation";

export default async function ({ params }: { params: { raceId: string } }) {
    const { raceId } = params;

    const race = await Task.tryCatch(trpcRSC.race.race.query({ raceId: Number(raceId) }));
    if (race.type !== "success") notFound();

    const players = await trpcRSC.player.startList.query({ raceId: Number.parseInt(raceId) });

    return <RaceStartList players={players} renderTime={new Date().getTime()} />;
}
