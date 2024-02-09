import { Task } from "@set/utils/dist/task";
import { notFound } from "next/navigation";
import Link from "next/link";
import { type Route } from "next";
import { type AppRouterOutputs } from "trpc";
import { publicTrpcRSC } from "public-trpc-core-rsc";

type Classification = AppRouterOutputs["classification"]["classifications"][0];

export default async function ({ params: { raceId } }: { params: { raceId: string } }) {
    const racePromise = Task.tryCatch(publicTrpcRSC.race.raceInformation.query({ raceId: parseInt(raceId) }));
    const classificationsPromise = Task.tryCatch(publicTrpcRSC.classification.classifications.query({ raceId: parseInt(raceId) }));

    const data = await Promise.all([racePromise, classificationsPromise]);
    const [race, classifications] = data;

    if ([race, classifications].some(r => r.type === "failure")) notFound();

    const hasOpenCategories = (classification: Classification) =>
        classification.categories.some(c => !c.minAge && !c.maxAge && !c.isSpecial);

    const hasAgeCategories = (classification: Classification) =>
        classification.categories.some(c => (c.minAge || c.maxAge) && !c.isSpecial);

    const hasSpecialCategories = (classification: Classification) => classification.categories.some(c => c.isSpecial);

    return (
        <div className="flex flex-col p-8">
            <div className="text-sm font-semibold">Live:</div>

            {classifications.result!.map(c => (
                <Link key={c.id} className="py-2 hover:underline" href={`/results/${raceId}/${c.id}` as Route}>
                    {c.name} 🚀
                </Link>
            ))}

            <div className="mt-4 text-sm font-semibold">Results:</div>
            {classifications.result!.map(c => (
                <div key={c.id}>
                    {hasOpenCategories(c) && <div>OPEN</div>}
                    {hasAgeCategories(c) && <div>AGE</div>}
                    {hasSpecialCategories(c) && <div>Special</div>}
                </div>
            ))}
        </div>
    );
}
