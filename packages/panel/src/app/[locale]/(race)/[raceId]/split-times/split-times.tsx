"use client";

import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { PageHeader } from "src/components/page-headers";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import type { AppRouterOutputs } from "src/trpc";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type SplitTime = AppRouterOutputs["splitTime"]["splitTimes"][0];

export const SplitTimes = () => {
    const raceId = useCurrentRaceId();
    const { data: splitTimes } = trpc.splitTime.splitTimes.useQuery({ raceId: raceId }, { refetchInterval: 5000 });

    const t = useTranslations();

    const cols: PoorDataTableColumn<SplitTime>[] = [
        {
            field: "bibNumber",
            headerName: t("pages.splitTimes.grid.columns.bibNumber"),
            sortable: true,
        },
        {
            field: "name",
            headerName: t("pages.splitTimes.grid.columns.playerName"),
            sortable: true,
        },
        {
            field: "lastName",
            headerName: t("pages.splitTimes.grid.columns.playerLastName"),
            sortable: true,
        },
        {
            field: "splitName",
            headerName: t("pages.splitTimes.grid.columns.splitName"),
            sortable: true,
        },
        {
            field: "classificationName",
            headerName: t("pages.splitTimes.grid.columns.classificationName"),
            sortable: true,
        },
        {
            field: "time",
            headerName: t("pages.splitTimes.grid.columns.time"),
            sortable: true,
            cellRenderer: data => formatTimeWithMilliSec(data.time),
        },
    ];

    return (
        <>
            <Head>
                <title>{t("pages.splitTimes.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.splitTimes.header.title")} description={t("pages.splitTimes.header.description")} />
                {splitTimes && (
                    <div className="flex-grow overflow-hidden">
                        <PoorDataTable
                            data={splitTimes}
                            columns={cols}
                            searchPlaceholder={t("pages.splitTimes.grid.search.placeholder")}
                            getRowId={item => item.id}
                            gridName="split-times"
                            searchFields={["name", "lastName", "bibNumber"]}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
