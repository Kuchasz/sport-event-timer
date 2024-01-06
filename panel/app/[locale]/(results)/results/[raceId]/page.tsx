import { trpcRSC } from "trpc-core-rsc";
import { Results } from "./results";
import { Task } from "@set/utils/dist/task";
import { notFound } from "next/navigation";

export default async function ({ params: { raceId } }: { params: { raceId: string } }) {
    const race = await Task.tryCatch(trpcRSC.race.basicInfo.query({ raceId: parseInt(raceId) }));
    if (race.type !== "success") notFound();

    const results = await trpcRSC.result.results.query({ raceId: parseInt(raceId) });

    return <Results raceId={parseInt(raceId)} initialResults={results} initialRace={race.result} />;
}
