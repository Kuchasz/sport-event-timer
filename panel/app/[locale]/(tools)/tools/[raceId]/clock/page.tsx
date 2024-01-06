import { trpcRSC } from "trpc-core-rsc";
import { RaceClock } from "./clock";
import { Task } from "@set/utils/dist/task";
import { notFound } from "next/navigation";

export default async function ({ params }: { params: { raceId: string } }) {
    const { raceId } = params;

    const race = await Task.tryCatch(trpcRSC.race.race.query({ raceId: Number(raceId) }));
    if (race.type !== "success") notFound();

    return <RaceClock />;
}
