import { trpcRSC } from "trpc-core-rsc";
import { Task } from "@set/utils/dist/task";
import { notFound } from "next/navigation";
import Link from "next/link";
import { type Route } from "next";

export default async function ({ params: { raceId } }: { params: { raceId: string } }) {
    const race = await Task.tryCatch(trpcRSC.race.raceInformation.query({ raceId: parseInt(raceId) }));
    if (race.type !== "success") notFound();

    const classifications = await trpcRSC.classification.classifications.query({ raceId: parseInt(raceId) });

    return (
        <div className="flex flex-col p-8">
            <div className="text-sm font-semibold">Choose classification:</div>
            {classifications.map(c => (
                <Link key={c.id} className="py-2 hover:underline" href={`/results/${raceId}/${c.id}` as Route}>
                    {c.name} 🚀
                </Link>
            ))}
        </div>
    );
}
