import { mdiProgressAlert, mdiProgressCheck } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import Link from "next/link";
import { SectionHeader } from "src/components/page-headers";
import { trpcRSC } from "src/trpc-core-rsc";

const ClassificationIcon = ({ splitsNumber }: { splitsNumber: number }) => {
    return splitsNumber === 0 ? <Icon size={0.7} path={mdiProgressAlert} /> : <Icon size={0.7} path={mdiProgressCheck} />;
};

const getAbbreviation = (name: string) => {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0].toUpperCase())
        .join("");
};

export const Classifications = async ({ raceId, classificationId }: { raceId: string; classificationId?: string }) => {
    const classifications = await trpcRSC.classification.classifications.query({ raceId: Number(raceId) });
    return (
        <div className="z-10 flex w-80 shrink-0 flex-col py-12 pl-12 pr-6 text-sm">
            <SectionHeader title="Classifications"></SectionHeader>
            {classifications.map(c => (
                <Link
                    className={classNames(
                        "my-0.5 flex rounded-md px-3 py-2",
                        c.id === Number(classificationId) ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100",
                    )}
                    href={`/${raceId}/splits/${c.id}`}
                    key={c.id}>
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white font-bold">
                        {getAbbreviation(c.name)}
                    </div>
                    <div className="ml-2 w-full min-w-0">
                        <div className="truncate font-medium">{c.name}</div>
                        <div className={classNames("mt-1 flex items-center text-xs", !c.splitsNumber ? "text-red-500" : "")}>
                            <ClassificationIcon splitsNumber={c.splitsNumber} />
                            <div className={classNames("ml-1 capitalize", c.splitsNumber && "opacity-60")}>
                                {c.splitsNumber ? `${c.splitsNumber} splits` : "no splits"}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};
