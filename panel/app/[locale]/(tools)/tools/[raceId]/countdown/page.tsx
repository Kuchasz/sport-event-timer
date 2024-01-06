import { Task } from "@set/utils/dist/task";
import { RaceCountdown } from "./countdown";
import { notFound } from "next/navigation";
import { trpcRSC } from "trpc-core-rsc";

export default async function ({ params }: { params: { raceId: string } }) {
    const { raceId } = params;

    const race = await Task.tryCatch(trpcRSC.race.race.query({ raceId: Number(raceId) }));
    if (race.type !== "success") notFound();

    return <RaceCountdown />;
}
