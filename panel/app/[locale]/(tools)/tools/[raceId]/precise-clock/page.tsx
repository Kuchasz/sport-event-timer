import { notFound } from "next/navigation";
import { RacePreciseClock } from "./precise-lock";
import { Task } from "@set/utils/dist/task";
import { trpcRSC } from "trpc-core-rsc";

export default async function ({ params }: { params: { raceId: string } }) {
    const { raceId } = params;

    const race = await Task.tryCatch(trpcRSC.race.race.query({ raceId: Number(raceId) }));
    if (race.type !== "success") notFound();

    return <RacePreciseClock />;
}
