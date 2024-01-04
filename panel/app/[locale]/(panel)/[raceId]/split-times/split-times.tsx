"use client";

import { mdiClockEditOutline, mdiClockPlusOutline, mdiReload } from "@mdi/js";
import Icon from "@mdi/react";
import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";
import { PoorConfirmation, PoorModal } from "components/poor-modal";
import { PageHeader } from "components/page-header";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { useTranslations } from "next-intl";
import Head from "next/head";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { SplitTimeEdit } from "../../../../../components/panel/split-time/split-time-edit";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";
import { toast } from "components/use-toast";

type SplitTime = AppRouterOutputs["splitTime"]["splitTimes"][0];
type RevertedSplitTime = AppRouterInputs["splitTime"]["revert"];

type SplitTimeResultTypes = {
    openResetDialog: (params: RevertedSplitTime) => Promise<void>;
    isLoading: boolean;
    splitTimeResult: {
        times: Record<number, { time: number; manual: boolean }>;
        bibNumber: string | null;
    };
    refetch: () => void;
    raceId: number;
    raceDate: Date;
    timingPointId: number;
};
const SplitTimeResult = ({
    refetch,
    isLoading,
    raceId,
    raceDate,
    openResetDialog,
    splitTimeResult,
    timingPointId,
}: SplitTimeResultTypes) => {
    const result = splitTimeResult.times[timingPointId];
    const t = useTranslations();
    return (
        <div className="flex font-mono">
            <span className={result?.manual ? "text-yellow-600" : ""}>
                {formatTimeWithMilliSec(splitTimeResult.times[timingPointId]?.time)}
            </span>
            <div className="flex-grow"></div>
            {result?.time > 0 && (
                <PoorModal
                    onResolve={refetch}
                    title={t("pages.splitTimes.edit.title")}
                    component={SplitTimeEdit}
                    componentProps={{
                        editedSplitTime: {
                            bibNumber: splitTimeResult.bibNumber!,
                            time: result?.time,
                            timingPointId: timingPointId,
                            raceId,
                        },
                        raceId,
                        raceDate: raceDate.getTime(),
                        onReject: () => {},
                    }}>
                    <span className="flex cursor-pointer items-center hover:text-red-600">
                        <Icon size={0.75} path={mdiClockEditOutline} />
                    </span>
                </PoorModal>
            )}
            {result == null && (
                <PoorModal
                    onResolve={refetch}
                    title={t("pages.splitTimes.edit.title")}
                    component={SplitTimeEdit}
                    componentProps={{
                        editedSplitTime: {
                            bibNumber: splitTimeResult.bibNumber!,
                            time: 0,
                            timingPointId: timingPointId,
                            raceId,
                        },
                        raceId,
                        raceDate: raceDate.getTime(),
                        onReject: () => {},
                    }}>
                    <span className="flex cursor-pointer items-center hover:text-red-600">
                        <Icon size={0.75} path={mdiClockPlusOutline} />
                    </span>
                </PoorModal>
            )}
            {result?.manual == true && (
                <PoorConfirmation
                    title={t("pages.splitTimes.revert.confirmation.title")}
                    message={t("pages.splitTimes.revert.confirmation.text")}
                    onAccept={() =>
                        openResetDialog({
                            bibNumber: splitTimeResult.bibNumber,
                            time: result?.time,
                            timingPointId: timingPointId,
                        } as any)
                    }
                    isLoading={isLoading}>
                    <span className="ml-2 flex cursor-pointer items-center hover:text-red-600">
                        <Icon size={0.75} path={mdiReload} />
                    </span>
                </PoorConfirmation>
            )}
        </div>
    );
};

export const SplitTimes = () => {
    const raceId = useCurrentRaceId();
    const { data: splitTimes, refetch } = trpc.splitTime.splitTimes.useQuery({ raceId: raceId });
    const { data: timingPoints } = trpc.timingPoint.timingPoints.useQuery(
        { raceId: raceId },
        {
            initialData: [],
        },
    );
    const { data: timingPointsOrder } = trpc.timingPoint.timingPointsOrder.useQuery({ raceId: raceId }, { initialData: [] });
    const { data: race } = trpc.race.race.useQuery({ raceId: raceId });

    const revertSplitTimeMutation = trpc.splitTime.revert.useMutation();
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
        ...timingPointsOrder
            .map(id => timingPoints.find(tp => tp.id === id)!)!
            .map(tp => ({
                field: tp.name as any,
                headerName: tp.name,
                cellRenderer: (data: SplitTime) => (
                    <SplitTimeResult
                        refetch={() => refetch()}
                        raceId={raceId}
                        raceDate={race?.date ?? new Date()}
                        openResetDialog={revertManualSplitTime}
                        splitTimeResult={data}
                        timingPointId={tp.id}
                        isLoading={revertSplitTimeMutation.isLoading}
                    />
                ),
            })),
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
                            getRowId={item => item.bibNumber}
                            gridName="split-times"
                            searchFields={["name", "lastName", "bibNumber"]}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
