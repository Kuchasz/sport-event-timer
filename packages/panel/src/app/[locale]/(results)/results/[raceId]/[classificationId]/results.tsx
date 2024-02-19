"use client";

import { mdiChevronDown, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";
import { formatGap, formatTimeWithMilliSec, formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";

import classNames from "classnames";
import { useLocale, useTranslations } from "next-intl";
import Head from "next/head";
import { useState } from "react";
import type { AppRouterOutputs } from "src/trpc";

type Results = AppRouterOutputs["result"]["results"];
type Race = AppRouterOutputs["race"]["raceInformation"];

const ResultsRow = ({
    i,
    result,
    toggleRow,
    displayDetails,
    openCategoriesExist,
    highlightOpenCategories,
    ageCategoriesExist,
}: {
    i: number;
    result: Results[0];
    toggleRow: (n: number) => void;
    displayDetails: boolean;
    openCategoriesExist: boolean;
    highlightOpenCategories: boolean;
    ageCategoriesExist: boolean;
}) => (
    <>
        <tr
            onClick={() => toggleRow(i)}
            className={classNames("cursor-pointer whitespace-nowrap", {
                "bg-white": i % 2 === 1,
                "bg-gray-100": i % 2 === 0,
            })}>
            <td className="px-1 py-2.5 text-center text-xs font-bold">{i + 1}</td>
            <td className="px-1 py-2.5 text-xs font-semibold uppercase">
                <span className="mr-1 font-semibold text-gray-500">{result.bibNumber}</span>
                {result.name.slice(0, 1)}. {result.lastName}
            </td>
            {openCategoriesExist && (
                <td className="flex flex-col items-center px-1 py-2.5 text-center text-xs">
                    <div
                        className={classNames("text-center", {
                            ["flex h-5 w-5 items-center justify-center rounded-md font-bold text-white"]:
                                highlightOpenCategories && result.openCategoryPlace && result.openCategoryPlace <= 3,
                            ["bg-orange-300"]: highlightOpenCategories && result.openCategoryPlace === 3,
                            ["bg-gray-300"]: highlightOpenCategories && result.openCategoryPlace === 2,
                            ["bg-yellow-300"]: highlightOpenCategories && result.openCategoryPlace === 1,
                        })}>
                        {result.openCategory && `${result.openCategoryPlace}`}
                    </div>
                </td>
            )}

            {ageCategoriesExist && (
                <td className="px-1 py-2.5 text-center text-xs">
                    {result.ageCategory && (
                        <span className="flex justify-between">
                            {result.ageCategory.name}
                            <p className="mx-0.5">/</p>
                            <p className="font-bold">{result.ageCategoryPlace}</p>
                        </span>
                    )}
                </td>
            )}

            <td
                className={classNames("px-1 py-2.5 text-center  text-xs font-semibold uppercase", {
                    "text-right": !result.invalidState,
                })}>
                {result.invalidState ? result.invalidState : !result.invalidState && formatGap(result.gap)}
            </td>
            <td className="pl-1 pr-2 text-gray-400">
                <Icon path={displayDetails ? mdiChevronDown : mdiChevronRight} size={0.8} />
            </td>
        </tr>
        {displayDetails ? <RowDetails i={i} result={result} /> : null}
    </>
);

const RowDetails = ({ i, result }: { i: number; result: Results[0] }) => {
    const t = useTranslations();
    return (
        <tr
            className={classNames("whitespace-nowrap", {
                "bg-white": i % 2 === 1,
                "bg-gray-100": i % 2 === 0,
            })}>
            <td colSpan={6} className="pb-3 pl-5 pr-2 text-xs font-medium">
                <div className="table-row font-semibold">
                    <div className="table-cell py-0.5">{t("results.grid.columns.player")}:</div>
                    <div className="table-cell py-0.5 pl-2">
                        {result.name} {result.lastName}
                    </div>
                </div>
                {result.team && (
                    <div className="table-row">
                        <div className="table-cell py-0.5">{t("results.grid.columns.team")}:</div>
                        <div className="table-cell py-0.5 pl-2">{result.team}</div>
                    </div>
                )}
                <div className="table-row">
                    <div className="table-cell py-0.5">{t("results.grid.columns.yearOfBirth")}:</div>
                    <div className="table-cell py-0.5 pl-2">{result.yearOfBirth}</div>
                </div>
                <div className="table-row">
                    <div className="table-cell py-0.5">{t("results.grid.columns.start")}:</div>
                    <div className="table-cell py-0.5 pl-2 font-mono">{!result.invalidState && formatTimeWithMilliSec(result.start)}</div>
                </div>
                <div className="table-row">
                    <div className="table-cell py-0.5">{t("results.grid.columns.finish")}:</div>
                    <div className="table-cell py-0.5 pl-2 font-mono">{!result.invalidState && formatTimeWithMilliSec(result.finish)}</div>
                </div>
                <div className="table-row font-semibold">
                    <div className="table-cell py-0.5">{t("results.grid.columns.result")}:</div>
                    <div className="table-cell py-0.5 pl-2 font-mono">
                        {result.invalidState
                            ? t(`results.abbreviations.${result.invalidState}` as any)
                            : formatTimeWithMilliSecUTC(result.result)}
                    </div>
                </div>
                {result.disqualification ? (
                    <div className="table-row">
                        <div className="table-cell py-0.5">{t("results.grid.columns.disqualifiaction")}</div>
                        <div className="table-cell whitespace-break-spaces py-0.5 pl-2 font-mono">{result.disqualification.reason}</div>
                    </div>
                ) : null}
                {result.timePenalties?.length ? (
                    <div className="table-row">
                        <div className="table-cell py-0.5">{t("results.grid.columns.penalties")}</div>
                        <div className="table-cell py-0.5 pl-2 font-mono">
                            {result.timePenalties.map(p => (
                                <div className="whitespace-break-spaces" key={p.id}>
                                    {formatTimeWithMilliSecUTC(p.time)} ({p.reason})
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
            </td>
        </tr>
    );
};

export const Results = ({
    title,
    results,
    race,
    highlightOpenCategories,
}: {
    title: string;
    results: Results;
    race: Race;
    highlightOpenCategories: boolean;
}) => {
    const [rowIds, setRowIds] = useState<number[]>([]);
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
                    <h3 className="text-sm font-semibold">
                        {race?.date?.toLocaleDateString(locale, { timeZone: "Europe/Warsaw" })}, {race?.location}
                    </h3>
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
                                <thead className="sticky top-0 bg-white">
                                    <tr className="bg-orange-500 text-white">
                                        <th className="px-2 text-left uppercase" colSpan={6}>
                                            {title}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className="w-12 px-1 py-2 text-xs text-gray-800">{t("results.grid.columns.place")}</th>
                                        <th className="px-1 py-2 text-left text-xs text-gray-800">{t("results.grid.columns.player")}</th>
                                        {openCategoriesExist && (
                                            <th className="px-1 py-2 text-xs text-gray-800">{t("results.grid.columns.open")}</th>
                                        )}
                                        {ageCategoriesExist && (
                                            <th className="px-1 py-2 text-xs text-gray-800">{t("results.grid.columns.category")}</th>
                                        )}
                                        <th className="py-2 text-right text-xs text-gray-800">{t("results.grid.columns.gap")}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-none bg-white">
                                    {results?.map((result, i) => (
                                        <ResultsRow
                                            key={result.bibNumber}
                                            i={i}
                                            result={result}
                                            toggleRow={toggleRow}
                                            displayDetails={rowIds.length > 0 && rowIds.includes(i)}
                                            openCategoriesExist={openCategoriesExist}
                                            highlightOpenCategories={highlightOpenCategories}
                                            ageCategoriesExist={ageCategoriesExist}
                                        />
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
