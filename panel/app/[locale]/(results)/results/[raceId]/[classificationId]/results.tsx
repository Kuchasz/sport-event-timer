"use client";

import { mdiChevronDown, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";
import { formatGap, formatTimeWithMilliSec, formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";
import classNames from "classnames";
import { useLocale, useTranslations } from "next-intl";
import Head from "next/head";
import React, { useState } from "react";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "trpc-core";

type Results = AppRouterOutputs["result"]["results"];
type Race = AppRouterOutputs["race"]["raceInformation"];

export const Results = ({
    raceId,
    classificationId,
    initialResults,
    initialRace,
}: {
    raceId: number;
    classificationId: number;
    initialResults: Results;
    initialRace: Race;
}) => {
    const { data: race } = trpc.race.raceInformation.useQuery({ raceId }, { initialData: initialRace });
    const { data: results } = trpc.result.results.useQuery(
        { raceId, classificationId },
        { refetchInterval: 10_000, initialData: initialResults },
    );
    const [rowIds, setRowIds] = useState<number[]>([]);

    const abbreviations = useTranslations("results.abbreviations");
    const t = useTranslations();
    const locale = useLocale();

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
                <div className="my-4 flex w-full max-w-[800px] flex-col px-4">
                    <h2 className="text-2xl font-semibold uppercase">{race?.name}</h2>
                    <h3 className="text-sm font-semibold">{race?.date?.toLocaleDateString(locale)}</h3>
                    <div className="mt-2 text-xs">
                        <span>{t("results.refresh.message")}</span>
                        <div className="mt-2"></div>
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-center">
                <div className="flex w-full flex-col items-center">
                    <div className="w-full max-w-xl">
                        <div className="w-full border-b border-gray-200 shadow">
                            <table className="w-full divide-y divide-gray-300">
                                <thead className="sticky top-0 bg-gray-100">
                                    <tr>
                                        <th className="w-12 px-1 py-2 text-xs text-gray-800">{t("results.grid.columns.place")}</th>
                                        <th className="px-1 py-2 text-left text-xs text-gray-800">{t("results.grid.columns.player")}</th>
                                        {openCategoriesExist && (
                                            <th className="px-1 py-2 text-xs text-gray-800">{t("results.grid.columns.open")}</th>
                                        )}
                                        {ageCategoriesExist && (
                                            <th className="px-1 py-2 text-xs text-gray-800">{t("results.grid.columns.category")}</th>
                                        )}
                                        <th className="px-1 py-2 text-right text-xs text-gray-800">{t("results.grid.columns.gap")}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-none bg-white">
                                    {results?.map((s, i) => (
                                        <React.Fragment key={i}>
                                            <tr
                                                onClick={() => toggleRow(i)}
                                                className={classNames("cursor-pointer whitespace-nowrap", {
                                                    "bg-white": i % 2 === 1,
                                                    "bg-gray-100": i % 2 === 0,
                                                })}>
                                                <td className="px-1 py-3 text-center text-xs">{i + 1}</td>
                                                <td className="px-1 py-3 text-xs font-semibold uppercase">
                                                    <span className="mr-1 font-semibold text-gray-500">{s.bibNumber}</span>
                                                    {s.name.slice(0, 1)}. {s.lastName}
                                                </td>
                                                {openCategoriesExist && (
                                                    <td className="flex flex-col items-center px-1 py-3 text-center text-xs">
                                                        <div
                                                            className={classNames("text-center", {
                                                                ["flex h-5 w-5 items-center justify-center rounded-md bg-gray-600 font-bold text-white"]:
                                                                    s.openCategoryPlace && s.openCategoryPlace <= 3,
                                                            })}>
                                                            {s.openCategory && `${s.openCategoryPlace}`}
                                                        </div>
                                                    </td>
                                                )}

                                                {ageCategoriesExist && (
                                                    <td className="px-1 py-3 text-center text-xs">
                                                        {s.ageCategory && `${s.ageCategory.name} / ${s.ageCategoryPlace}`}
                                                    </td>
                                                )}

                                                <td
                                                    className={classNames(
                                                        "px-1 py-3 text-center font-mono text-xs font-semibold uppercase",
                                                        { "text-right": !s.invalidState },
                                                    )}>
                                                    {s.invalidState ? s.invalidState : !s.invalidState && formatGap(s.gap)}
                                                </td>
                                                <td>
                                                    <Icon path={rowIds.includes(i) ? mdiChevronDown : mdiChevronRight} size={0.8} />
                                                </td>
                                            </tr>
                                            {rowIds.includes(i) && (
                                                <tr
                                                    className={classNames("whitespace-nowrap", {
                                                        "bg-white": i % 2 === 1,
                                                        "bg-gray-100": i % 2 === 0,
                                                    })}>
                                                    <td colSpan={6} className="pb-3 pl-5 pr-2 text-xs font-medium">
                                                        <div className="table-row font-semibold">
                                                            <div className="table-cell py-0.5">{t("results.grid.columns.player")}:</div>
                                                            <div className="table-cell py-0.5 pl-2">
                                                                {s.name} {s.lastName}
                                                            </div>
                                                        </div>
                                                        {s.team && (
                                                            <div className="table-row">
                                                                <div className="table-cell py-0.5">{t("results.grid.columns.team")}:</div>
                                                                <div className="table-cell py-0.5 pl-2">{s.team}</div>
                                                            </div>
                                                        )}
                                                        <div className="table-row">
                                                            <div className="table-cell py-0.5">
                                                                {t("results.grid.columns.yearOfBirth")}:
                                                            </div>
                                                            <div className="table-cell py-0.5 pl-2">{s.yearOfBirth}</div>
                                                        </div>
                                                        <div className="table-row">
                                                            <div className="table-cell py-0.5">{t("results.grid.columns.start")}:</div>
                                                            <div className="table-cell py-0.5 pl-2 font-mono">
                                                                {!s.invalidState && formatTimeWithMilliSec(s.start)}
                                                            </div>
                                                        </div>
                                                        <div className="table-row">
                                                            <div className="table-cell py-0.5">{t("results.grid.columns.finish")}:</div>
                                                            <div className="table-cell py-0.5 pl-2 font-mono">
                                                                {!s.invalidState && formatTimeWithMilliSec(s.finish)}
                                                            </div>
                                                        </div>
                                                        <div className="table-row font-semibold">
                                                            <div className="table-cell py-0.5">{t("results.grid.columns.result")}:</div>
                                                            <div className="table-cell py-0.5 pl-2 font-mono">
                                                                {s.invalidState
                                                                    ? abbreviations(s.invalidState as any)
                                                                    : formatTimeWithMilliSecUTC(s.result)}
                                                            </div>
                                                        </div>
                                                        {s.disqualification ? (
                                                            <div className="table-row">
                                                                <div className="table-cell py-0.5">
                                                                    {t("results.grid.columns.disqualifiaction")}
                                                                </div>
                                                                <div className="table-cell whitespace-break-spaces py-0.5 pl-2 font-mono">
                                                                    {s.disqualification.reason}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                        {s.timePenalties?.length ? (
                                                            <div className="table-row">
                                                                <div className="table-cell py-0.5">
                                                                    {t("results.grid.columns.penalties")}
                                                                </div>
                                                                <div className="table-cell py-0.5 pl-2 font-mono">
                                                                    {s.timePenalties.map(p => (
                                                                        <div className="whitespace-break-spaces" key={p.id}>
                                                                            {formatTimeWithMilliSecUTC(p.time)} ({p.reason})
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
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
