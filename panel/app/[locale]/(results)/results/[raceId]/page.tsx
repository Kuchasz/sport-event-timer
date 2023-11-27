import { trpcRSC } from "trpc-core-rsc";
import { Results } from "./results";

export default async function ({ params: { raceId } }: { params: { raceId: string } }) {
    const race = await trpcRSC.race.basicInfo.query({ raceId: parseInt(raceId) });
    const results = await trpcRSC.result.results.query({ raceId: parseInt(raceId) });

    return <Results initialResults={results} initialRace={race} />;
}
