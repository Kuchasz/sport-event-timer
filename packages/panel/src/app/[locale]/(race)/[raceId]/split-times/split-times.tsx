"use client";

import { useTranslations } from "next-intl";
import Head from "next/head";
import { PageHeader } from "src/components/page-headers";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";
import { SplitTimeResult } from "src/components/split-time-result";

type SplitTime = AppRouterOutputs["splitTime"]["splitTimes"][0];
type RevertedSplitTime = AppRouterInputs["splitTime"]["revert"];

export const SplitTimes = () => {
    const raceId = useCurrentRaceId();
    const { data: splitTimes, refetch } = trpc.splitTime.splitTimes.useQuery({ raceId: raceId }, { refetchInterval: 5000 });
    const { data: race } = trpc.race.race.useQuery({ raceId: raceId });

    const t = useTranslations();
    const revertSplitTimeMutation = trpc.splitTime.revert.useMutation();

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
            field: "classificationName",
            headerName: t("pages.splitTimes.grid.columns.classificationName"),
            sortable: true,
        },
        {
            field: "splitName",
            headerName: t("pages.splitTimes.grid.columns.splitName"),
            sortable: true,
        },
        {
            field: "timingPointName",
            headerName: t("pages.splitTimes.grid.columns.timingPointName"),
            sortable: true,
        },
        {
            field: "time",
            headerName: t("pages.splitTimes.grid.columns.time"),
            sortable: true,
            cellRenderer: data => (
                <SplitTimeResult
                    refetch={() => refetch()}
                    raceId={raceId}
                    raceDate={race?.date ?? new Date()}
                    openResetDialog={revertManualSplitTime}
                    bibNumber={data.bibNumber}
                    splitTime={data.time}
                    isLoading={revertSplitTimeMutation.isLoading}
                    splitId={data.splitId}
                    classificationId={data.classificationId}
                />
            ),
        },
    ];

    const revertManualSplitTime = async (editedSplitTime: RevertedSplitTime) => {
        await revertSplitTimeMutation.mutateAsync(editedSplitTime);
        await refetch();
    };

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
