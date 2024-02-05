import { trpcRSC } from "trpc-core-rsc";
import { Results } from "./results";
import { Task } from "@set/utils/dist/task";
import { notFound } from "next/navigation";

export default async function ({ params: { raceId, classificationId } }: { params: { raceId: string; classificationId: string } }) {
    const race = await Task.tryCatch(trpcRSC.race.raceInformation.query({ raceId: parseInt(raceId) }));
    if (race.type !== "success") notFound();

    const results = await trpcRSC.result.results.query({ raceId: parseInt(raceId), classificationId: parseInt(classificationId) });

    return (
        <Results
            raceId={parseInt(raceId)}
            classificationId={parseInt(classificationId)}
            initialResults={results}
            initialRace={race.result}
        />
    );
}
