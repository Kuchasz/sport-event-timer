import { Task } from "@set/utils/dist/task";
import { notFound } from "next/navigation";
import Link from "next/link";
import { type Route } from "next";
import { publicTrpcRSC } from "trpc-core-public-rsc";

export default async function ({ params: { raceId } }: { params: { raceId: string } }) {
    const racePromise = Task.tryCatch(publicTrpcRSC.race.raceInformation.query({ raceId: parseInt(raceId) }));
    const classificationsPromise = Task.tryCatch(publicTrpcRSC.classification.classifications.query({ raceId: parseInt(raceId) }));

    const data = await Promise.all([racePromise, classificationsPromise]);
    const [race, classifications] = data;

    if ([race, classifications].some(r => r.type === "failure")) notFound();

    return (
        <div className="flex flex-col p-8">
            <div className="text-sm font-semibold">Live:</div>

            {classifications.result!.map(c => (
                <Link key={c.id} className="py-2 hover:underline" href={`/results/${raceId}/${c.id}` as Route}>
                    {c.name} 🚀
                </Link>
            ))}
        </div>
    );
}
