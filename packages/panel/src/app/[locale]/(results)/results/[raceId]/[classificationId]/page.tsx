import { Results } from "./results";
import { Task } from "@set/utils/dist/task";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { publicTrpcRSC } from "src/trpc-core-public-rsc";

export default async function ({ params: { raceId, classificationId } }: { params: { raceId: string; classificationId: string } }) {
    const racePromise = Task.tryCatch(publicTrpcRSC.race.raceInformation.query({ raceId: parseInt(raceId) }));
    const resultsPromise = Task.tryCatch(
        publicTrpcRSC.result.results.query({ raceId: parseInt(raceId), classificationId: parseInt(classificationId) }),
    );
    const classificationsPromise = Task.tryCatch(publicTrpcRSC.classification.classifications.query({ raceId: parseInt(raceId) }));
    const splitsPromise = Task.tryCatch(
        publicTrpcRSC.split.splits.query({ raceId: parseInt(raceId), classificationId: parseInt(classificationId) }),
    );

    const data = await Promise.all([racePromise, resultsPromise, classificationsPromise, splitsPromise]);
    const [race, results, classifications, splits] = data;

    if ([race, results, classifications, splits].some(r => r.type === "failure")) notFound();

    const t = await getTranslations();

    return (
        <Results
            title={`${classifications.result!.find(c => c.id === Number(classificationId))!.name} - ${t("results.header.live")}`}
            highlightOpenCategories={false}
            initialResults={results.result!}
            race={race.result!}
            splits={splits.result!}
        />
    );
}
