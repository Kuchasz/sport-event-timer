import { trpcRSC } from "trpc-core-rsc";
import { Results } from "./results";
import { Task } from "@set/utils/dist/task";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function ({ params: { raceId, classificationId } }: { params: { raceId: string; classificationId: string } }) {
    const race = await Task.tryCatch(trpcRSC.race.raceInformation.query({ raceId: parseInt(raceId) }));
    if (race.type !== "success") notFound();

    const t = await getTranslations();

    const results = await trpcRSC.result.results.query({ raceId: parseInt(raceId), classificationId: parseInt(classificationId) });
    const classifications = await trpcRSC.classification.classifications.query({ raceId: parseInt(raceId) });

    return (
        <Results
            title={`${classifications.find(c => c.id === Number(classificationId))!.name} - ${t("results.header.live")}`}
            highlightOpenCategories={false}
            results={results}
            race={race.result}
        />
    );
}
