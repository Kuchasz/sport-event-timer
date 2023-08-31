"use client";

import { Gender } from "@set/timer/dist/model";
import { formatGap, formatTimeWithMilliSec, formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";
import { trpc } from "trpc-core";
import Head from "next/head";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import classNames from "classnames";
import Icon from "@mdi/react";
import { mdiChevronDown, mdiChevronRight } from "@mdi/js";

const Gender = ({ gender }: { gender: Gender }) => <div>{gender.slice(0, 1)}</div>;

export const Results = () => {
    const { raceId } = useParams() as { raceId: string };
    const { data: race } = trpc.race.basicInfo.useQuery({ raceId: parseInt(raceId! as string) }, { enabled: !!raceId });
    const { data: results, dataUpdatedAt } = trpc.result.results.useQuery(
        { raceId: parseInt(raceId! as string) },
        { enabled: !!raceId, refetchInterval: 10_000 }
    );
    const [rowIds, setRowIds] = useState<number[]>([]);

    const abbreviations = useTranslations("results.abbreviations");
    const t = useTranslations();

    const toggleRow = (rowId: number) => {
        const newRowIds = rowIds.includes(rowId) ? rowIds.filter(r => r !== rowId) : [...rowIds, rowId];

        setRowIds(newRowIds);
    };

    const openCategoriesExist = results?.some(r => !!r.openCategory);
    const ageCategoriesExist = results?.some(r => !!r.ageCategory);

    return (
        <>
            <Head>
                <title>{t("results.header.title")}</title>
            </Head>
            <div className="flex flex-col items-center">
                <div className="max-w-[800px] flex my-8 px-4 flex-col">
                    <h2 className="font-semibold uppercase text-3xl">{race?.name}</h2>
                    <h3>{race?.date?.toLocaleDateString()}</h3>
                    <div className="mt-2">
                        <span>{t("results.refresh.message")}</span>
                        <span className="ml-2">
                            {t("results.refresh.lastUpdate", { updatedAt: new Date(dataUpdatedAt).toLocaleTimeString("pl") })}
                        </span>
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center">
                <div className="flex w-full flex-col items-center">
                    <div className="w-full max-w-xl">
                        <div className="border-b w-full border-gray-200 shadow">
                            <table className="divide-y w-full divide-gray-300 ">
                                <thead className="top-0 sticky bg-gray-100">
                                    <tr>
                                        <th className="px-1 py-4 text-xs text-gray-800">{t("results.grid.columns.place")}</th>
                                        <th className="px-1 py-4 text-xs text-gray-800">{t("results.grid.columns.bibNumber")}</th>
                                        <th className="px-1 py-4 text-xs text-left text-gray-800">{t("results.grid.columns.player")}</th>
                                        {openCategoriesExist && (
                                            <th className="px-1 py-4 text-xs text-gray-800">{t("results.grid.columns.open")}</th>
                                        )}
                                        {ageCategoriesExist && (
                                            <th className="px-1 py-4 text-xs text-gray-800">{t("results.grid.columns.category")}</th>
                                        )}
                                        <th className="px-1 py-4 text-right text-xs text-gray-800">{t("results.grid.columns.gap")}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-300">
                                    {results &&
                                        results.map((s, i) => (
                                            <>
                                                <tr
                                                    onClick={() => toggleRow(i)}
                                                    key={i}
                                                    className={classNames("whitespace-nowrap cursor-pointer hover:bg-gray-100", {
                                                        "bg-gray-200": rowIds.includes(i),
                                                    })}
                                                >
                                                    <td className="px-1 py-2 text-center text-xs">{i + 1}.</td>
                                                    <td className="px-1 py-2 text-center text-xs font-semibold">{s.bibNumber}</td>
                                                    <td className="px-1 font-semibold py-2 text-xs">
                                                        {s.name} <div>{s.lastName}</div>
                                                    </td>

                                                    {/* {(openCategoriesExist || ageCategoriesExist) && (
                                                        <td className="px-1 py-2 text-xs">
                                                            {openCategories.map(
                                                                c =>
                                                                    s.openCategory?.name === c && (
                                                                        <div key={c}>
                                                                            {s.openCategory.name} ({s.openCategoryPlace})
                                                                        </div>
                                                                    )
                                                            )}
                                                            {ageCategoriesExist && s.ageCategory && (
                                                                <div>
                                                                    {s.ageCategory.name} ({s.ageCategoryPlace})
                                                                </div>
                                                            )}
                                                        </td>
                                                    )} */}

                                                    {openCategoriesExist && (
                                                        <td className="px-1 py-2 text-center text-xs">
                                                            {s.openCategory && `${s.openCategoryPlace}`}
                                                        </td>
                                                    )}

                                                    {ageCategoriesExist && (
                                                        <td className="px-1 py-2 text-center text-xs">
                                                            {s.ageCategory && `${s.ageCategory.name} / ${s.ageCategoryPlace}`}
                                                        </td>
                                                    )}

                                                    {/* {openCategories.map(c => (
                                                        <td key={c} className="px-1 text-center py-2 text-xs">
                                                            {s.openCategory?.name === c && s.openCategoryPlace}
                                                        </td>
                                                    ))}
                                                    {ageCategoriesExist && (
                                                        <td className="px-1 py-2 text-center text-xs">
                                                            {s.ageCategory && `${s.ageCategory.name} / ${s.ageCategoryPlace}`}
                                                        </td>
                                                    )} */}
                                                    <td
                                                        className={classNames(
                                                            "px-1 font-semibold uppercase text-center font-mono py-2 text-xs",
                                                            { "text-right": !s.invalidState }
                                                        )}
                                                    >
                                                        {s.invalidState ? s.invalidState : !s.invalidState && formatGap(s.gap)}
                                                    </td>
                                                    <td>
                                                        <Icon className="text-gray-500" path={rowIds.includes(i) ? mdiChevronDown : mdiChevronRight} size={1} />
                                                    </td>
                                                </tr>
                                                {rowIds.includes(i) && (
                                                    <tr key={i} className="bg-gray-100 whitespace-nowrap">
                                                        <td colSpan={10} className="px-2 font-medium py-1 text-xs">
                                                            <div className="table-row">
                                                                <div className="py-0.5 table-cell">
                                                                    {t("results.grid.columns.yearOfBirth")}:
                                                                </div>
                                                                <div className="py-0.5 pl-2 table-cell">{s.yearOfBirth ?? ""}</div>
                                                            </div>
                                                            <div className="table-row">
                                                                <div className="py-0.5 table-cell">{t("results.grid.columns.team")}:</div>
                                                                <div className="py-0.5 pl-2 table-cell">{s.team ?? ""}</div>
                                                            </div>
                                                            <div className="table-row">
                                                                <div className="py-0.5 table-cell">{t("results.grid.columns.start")}:</div>
                                                                <div className="py-0.5 pl-2 font-mono table-cell">
                                                                    {!s.invalidState && formatTimeWithMilliSec(s.start)}
                                                                </div>
                                                            </div>
                                                            <div className="table-row">
                                                                <div className="py-0.5 table-cell">{t("results.grid.columns.finish")}:</div>
                                                                <div className="py-0.5 pl-2 font-mono table-cell">
                                                                    {!s.invalidState && formatTimeWithMilliSec(s.finish)}
                                                                </div>
                                                            </div>
                                                            <div className="table-row font-semibold">
                                                                <div className="py-0.5 table-cell">{t("results.grid.columns.result")}:</div>
                                                                <div className="py-0.5 pl-2 font-mono table-cell">
                                                                    {s.invalidState
                                                                        ? abbreviations(s.invalidState as any)
                                                                        : formatTimeWithMilliSecUTC(s.result)}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

{
    /* <table className="divide-y divide-gray-300 ">
<thead className="top-0 sticky bg-gray-50">
    <tr>
        <th className="px-4 py-2 text-xs text-gray-500">#</th>
        <th className="px-4 py-2 text-xs text-gray-500">{t("results.grid.columns.bibNumber")}</th>
        <th className="px-4 py-2 text-xs text-left text-gray-500">{t("results.grid.columns.name")}</th>
        <th className="px-4 py-2 text-xs text-left text-gray-500">{t("results.grid.columns.team")}</th>
        {openCategories.map(c => (
            <th key={c} className="px-4 py-2 text-xs text-gray-500">
                {c}
            </th>
        ))}
        {ageCategoriesExist && (
            <th className="px-4 py-2 text-xs text-gray-500">{t("results.grid.columns.category")}</th>
        )}
        <th className="px-4 py-2 text-xs text-gray-500">{t("results.grid.columns.start")}</th>
        <th className="px-4 py-2 text-xs text-gray-500">{t("results.grid.columns.finish")}</th>
        <th className="px-4 py-2 text-xs text-gray-500">{t("results.grid.columns.result")}</th>
        <th className="px-4 py-2 text-xs text-gray-500">{t("results.grid.columns.gap")}</th>
    </tr>
</thead>
<tbody className="bg-white divide-y divide-gray-300">
    {results &&
        results.map((s, i) => (
            <>
                <tr key={i} className="whitespace-nowrap">
                    <td className="px-4 py-2 text-center text-xs">{i + 1}</td>
                    <td className="px-4 py-2 text-center text-xs font-semibold">{s.bibNumber}</td>
                    <td className="px-4 font-semibold py-2 text-xs">
                        {s.name} {s.lastName}
                    </td>
                    <td className="px-4 py-2 text-xs text-ellipsis">{s.team ?? ""}</td>
                    {openCategories.map(c => (
                        <td key={c} className="px-4 text-center py-2 text-xs">
                            {s.openCategory?.name === c && s.openCategoryPlace}
                        </td>
                    ))}
                    {ageCategoriesExist && (
                        <td className="px-4 py-2 text-center text-xs">
                            {s.ageCategory && `${s.ageCategory.name} / ${s.ageCategoryPlace}`}
                        </td>
                    )}
                    <td className="px-4 font-mono text-center py-2 text-xs">
                        {!s.invalidState && formatTimeWithMilliSec(s.start)}
                    </td>
                    <td className="px-4 font-mono text-center py-2 text-xs">
                        {!s.invalidState && formatTimeWithMilliSec(s.finish)}
                    </td>
                    <td className="px-4 font-semibold uppercase text-right font-mono py-2 text-xs">
                        {s.invalidState ? s.invalidState : formatTimeWithMilliSecUTC(s.result)}
                    </td>
                    <td className="px-4 text-right font-mono py-2 text-xs">
                        {!s.invalidState && formatGap(s.gap)}
                    </td>
                </tr>
                <tr key={i} className="whitespace-nowrap">
                    <td colSpan={10} className="px-4 py-2 text-center text-xs"></td>
                </tr>
            </>
        ))}
</tbody>
</table> */
}
