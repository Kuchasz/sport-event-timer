"use client";

import { mdiClockEditOutline, mdiClockPlusOutline, mdiReload } from "@mdi/js";
import Icon from "@mdi/react";
import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";
import { NiceConfirmation, NiceModal } from "components/modal";
import { PageHeader } from "components/page-header";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { Demodal } from "demodal";
import { useTranslations } from "next-intl";
import Head from "next/head";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { Confirmation } from "../../../../../components/confirmation";
import { SplitTimeEdit } from "../../../../../components/panel/split-time/split-time-edit";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type SplitTime = AppRouterOutputs["splitTime"]["splitTimes"][0];
type RevertedSplitTime = AppRouterInputs["splitTime"]["revert"];
type EditedSplitTime = AppRouterInputs["splitTime"]["update"];

type SplitTimeResultTypes = {
    openEditDialog: (params: SplitTime) => Promise<void>;
    openResetDialog: (params: RevertedSplitTime) => Promise<void>;
    splitTimeResult: {
        times: Record<number, { time: number; manual: boolean }>;
        bibNumber: string | null;
    };
    timingPointId: number;
};
const SplitTimeResult = ({ openEditDialog, openResetDialog, splitTimeResult, timingPointId }: SplitTimeResultTypes) => {
    const result = splitTimeResult.times[timingPointId];
    return (
        <div className="flex font-mono">
            <span className={result?.manual ? "text-yellow-600" : ""}>
                {formatTimeWithMilliSec(splitTimeResult.times[timingPointId]?.time)}
            </span>
            <div className="flex-grow"></div>
            {result?.time > 0 && (
                <span
                    onClick={() =>
                        openEditDialog({
                            bibNumber: splitTimeResult.bibNumber,
                            time: result?.time,
                            timingPointId: timingPointId,
                        } as any)
                    }
                    className="flex cursor-pointer items-center hover:text-red-600">
                    <Icon size={0.75} path={mdiClockEditOutline} />
                    {/* <span className="ml-1">change</span> */}
                </span>
            )}
            {result == null && (
                <span
                    onClick={() =>
                        openEditDialog({
                            bibNumber: splitTimeResult.bibNumber,
                            time: 0,
                            timingPointId: timingPointId,
                        } as any)
                    }
                    className="flex cursor-pointer items-center hover:text-red-600">
                    <Icon size={0.75} path={mdiClockPlusOutline} />
                    {/* <span className="ml-1">change</span> */}
                </span>
            )}
            {result?.manual == true && (
                <span
                    onClick={() =>
                        openResetDialog({
                            bibNumber: splitTimeResult.bibNumber,
                            time: result?.time,
                            timingPointId: timingPointId,
                        } as any)
                    }
                    className="ml-2 flex cursor-pointer items-center hover:text-red-600">
                    <Icon size={0.75} path={mdiReload} />
                    {/* <span className="ml-1">revert</span> */}
                </span>
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
                        openEditDialog={openEditDialog}
                        openResetDialog={openRevertDialog}
                        splitTimeResult={data}
                        timingPointId={tp.id}
                    />
                ),
            })),
    ];

    const openEditDialog = async (editedSplitTime: SplitTime) => {
        const splitTime = await Demodal.open<EditedSplitTime>(NiceModal, {
            title: t("pages.splitTimes.edit.title"),
            component: SplitTimeEdit,
            props: {
                editedSplitTime,
                raceId,
                raceDate: race?.date?.getTime(),
            },
        });

        if (splitTime) {
            await refetch();
        }
    };

    const openRevertDialog = async (editedSplitTime: RevertedSplitTime) => {
        const confirmed = await Demodal.open<boolean>(NiceConfirmation, {
            title: t("pages.splitTimes.revert.confirmation.title"),
            component: Confirmation,
            props: {
                message: t("pages.splitTimes.revert.confirmation.text"),
            },
        });

        if (confirmed) {
            await revertSplitTimeMutation.mutateAsync(editedSplitTime);
            await refetch();
        }
    };

    return (
        <>
            <Head>
                <title>{t("pages.splitTimes.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.splitTimes.header.title")} description={t("pages.splitTimes.header.description")} />
                {splitTimes && (
                    <div className="m-4 flex-grow overflow-hidden rounded-xl p-8 shadow-md">
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
