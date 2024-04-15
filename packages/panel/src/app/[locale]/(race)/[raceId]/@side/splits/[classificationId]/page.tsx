import classNames from "classnames";
import Link from "next/link";
import { SectionHeader } from "src/components/page-headers";
import { trpcRSC } from "src/trpc-core-rsc";

export default async ({ params: { raceId, classificationId } }: { params: { raceId: string; classificationId?: string } }) => {
    const classifications = await trpcRSC.classification.classifications.query({ raceId: Number(raceId) });
    return (
        <div className="z-10 flex w-80 shrink-0 flex-col p-8 text-sm">
            <SectionHeader title="Classifications"></SectionHeader>
            {classifications.map(c => (
                <Link
                    className={classNames(
                        "my-0.5 rounded-md px-3 py-2 font-medium",
                        c.id === Number(classificationId) ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100",
                    )}
                    href={`/${raceId}/splits/${c.id}`}
                    key={c.id}>
                    {c.name}
                </Link>
            ))}
        </div>
    );
};
