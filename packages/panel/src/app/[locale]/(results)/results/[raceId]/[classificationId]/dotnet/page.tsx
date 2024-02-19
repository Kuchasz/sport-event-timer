import { Results } from "../results";
// import { Task } from "@set/utils/dist/task";
// import { notFound } from "next/navigation";
// import { getTranslations } from "next-intl/server";
// import { publicTrpcRSC } from "src/trpc-core-public-rsc";
import { getDotnetData } from "../api_dotnet";

export default async function ({ params: {} }: { params: { raceId: string; classificationId: string } }) {
    // const racePromise = Task.tryCatch(publicTrpcRSC.race.raceInformation.query({ raceId: parseInt(raceId) }));
    // const resultsPromise = Task.tryCatch(getDotnetData());
    // const classificationsPromise = Task.tryCatch(publicTrpcRSC.classification.classifications.query({ raceId: parseInt(raceId) }));

    const data = await getDotnetData();

    // const data = await Promise.all([racePromise, resultsPromise, classificationsPromise]);
    // const [race, results, classifications] = data;
    // if ([race, results, classifications].some(r => r.type === "failure")) notFound();

    // const t = await getTranslations();

    return (
        <Results
            // title={`${classifications.result!.find(c => c.id === Number(classificationId))!.name} - ${t("results.header.live")}`}
            title={"results.header.live"}
            highlightOpenCategories={false}
            results={data as any}
            // race={race.result!}
        />
    );
}
