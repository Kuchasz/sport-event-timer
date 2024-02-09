// import { Task } from "@set/utils/dist/task";
// import { notFound } from "next/navigation";
// import Link from "next/link";
// import { type Route } from "next";
// import { type AppRouterOutputs } from "trpc";
// import { publicTrpcRSC } from "public-trpc-core-rsc";

// type Classification = AppRouterOutputs["classification"]["classifications"][0];

// export default async function ({ params: { raceId } }: { params: { raceId: string } }) {
//     const race = await Task.tryCatch(publicTrpcRSC.race.raceInformation.query({ raceId: parseInt(raceId) }));
//     if (race.type !== "success") notFound();

//     const classifications = await publicTrpcRSC.classification.classifications.query({ raceId: parseInt(raceId) });

//     const hasOpenCategories = (classification: Classification) =>
//         classification.categories.some(c => !c.minAge && !c.maxAge && !c.isSpecial);

//     const hasAgeCategories = (classification: Classification) =>
//         classification.categories.some(c => (c.minAge || c.maxAge) && !c.isSpecial);

//     const hasSpecialCategories = (classification: Classification) => classification.categories.some(c => c.isSpecial);

//     return (
//         <div className="flex flex-col p-8">
//             <div className="text-sm font-semibold">Live:</div>

//             {classifications.map(c => (
//                 <Link key={c.id} className="py-2 hover:underline" href={`/results/${raceId}/${c.id}` as Route}>
//                     {c.name} 🚀
//                 </Link>
//             ))}

//             <div className="mt-4 text-sm font-semibold">Results:</div>
//             {classifications.map(c => (
//                 <div key={c.id}>
//                     {hasOpenCategories(c) && <div>OPEN</div>}
//                     {hasAgeCategories(c) && <div>AGE</div>}
//                     {hasSpecialCategories(c) && <div>Special</div>}
//                 </div>
//             ))}
//         </div>
//     );
// }

import { Task } from "@set/utils/dist/task";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { publicTrpcRSC } from "public-trpc-core-rsc";
import { Results } from "./[classificationId]/race-results";

export default async function ({ params: { raceId } }: { params: { raceId: string; classificationId: string } }) {
    const racePromise = Task.tryCatch(publicTrpcRSC.race.raceInformation.query({ raceId: parseInt(raceId) }));
    const resultsPromise = Task.tryCatch(publicTrpcRSC.result.results.query({ raceId: parseInt(raceId), classificationId: 31 }));
    const classificationsPromise = Task.tryCatch(publicTrpcRSC.classification.classifications.query({ raceId: parseInt(raceId) }));

    const data = await Promise.all([racePromise, resultsPromise, classificationsPromise]);
    const [race, results, classifications] = data;

    if ([race, results, classifications].some(r => r.type === "failure")) notFound();

    const t = await getTranslations();

    return (
        <Results
            title={`${classifications.result!.find(c => c.id === Number(31))!.name} - ${t("results.header.live")}`}
            highlightOpenCategories={false}
            results={results.result!}
            race={race.result!}
        />
    );
}
