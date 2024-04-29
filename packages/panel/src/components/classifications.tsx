import classNames from "classnames";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { SectionHeaderTitle } from "src/components/page-headers";
import { type AppRouterOutputs } from "src/trpc";

type Classifications = AppRouterOutputs["classification"]["classifications"];

const getAbbreviation = (name: string) => {
    return name
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0].toUpperCase())
        .join("");
};

export const Classifications = ({
    raceId,
    classificationId,
    classifications,
}: {
    raceId: string;
    classificationId?: string;
    classifications: Classifications;
}) => {
    const t = useTranslations();
    return (
        <div className="flex w-64 shrink-0 flex-col border-r bg-white text-sm">
            <div className="pl-4 pt-4">
                <SectionHeaderTitle title={t("shared.classifications")} />
            </div>
            {classifications.map(c => (
                <Link
                    className={classNames(
                        "flex border-b p-4 ",
                        c.id === Number(classificationId) ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100",
                    )}
                    href={`/${raceId}/splits/${c.id}`}
                    key={c.id}>
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-50 font-bold">
                        {getAbbreviation(c.name)}
                    </div>
                    <div className="ml-4 w-full min-w-0">
                        <div className="truncate font-medium">{c.name}</div>
                        <div className={classNames("mt-1 flex items-center text-xs", !c.splitsNumber ? "text-red-500" : "")}>
                            <div className={classNames("font-medium capitalize", c.splitsNumber && "opacity-60")}>
                                {c.splitsNumber ? `${c.splitsNumber} splits` : "no splits"}
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};
