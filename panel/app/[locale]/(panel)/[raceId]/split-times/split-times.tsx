"use client";

import Icon from "@mdi/react";
import { Confirmation } from "../../../../../components/confirmation";
import { Demodal } from "demodal";
import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../../../trpc-core";
import { mdiClockEditOutline, mdiClockPlusOutline, mdiReload } from "@mdi/js";
import { NiceModal } from "components/modal";
import { SplitTimeEdit } from "../../../../../components/split-time-edit";
import { useCurrentRaceId } from "../../../../../hooks";
import { AgGridReact } from "@ag-grid-community/react";
import type { ColDef } from "@ag-grid-community/core";
import { useCallback, useRef } from "react";
import { PageHeader } from "components/page-header";
import Head from "next/head";
import { useTranslations } from "next-intl";
import { refreshRow } from "ag-grid";

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
                    className="flex cursor-pointer items-center hover:text-red-600"
                >
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
                    className="flex cursor-pointer items-center hover:text-red-600"
                >
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
                    className="ml-2 flex cursor-pointer items-center hover:text-red-600"
                >
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
    const gridRef = useRef<AgGridReact<SplitTime>>(null);
    const updateSplitTimeMutation = trpc.splitTime.update.useMutation();
    const revertSplitTimeMutation = trpc.splitTime.revert.useMutation();
    const t = useTranslations();

    const defaultColumns: ColDef<SplitTime>[] = [
        {
            field: "bibNumber",
            headerName: t("pages.splitTimes.grid.columns.bibNumber"),
            sortable: true,
            sort: "asc",
            width: 100,
            comparator: (valueA, valueB) => valueA - valueB,
        },
        {
            field: "name",
            resizable: true,
            headerName: t("pages.splitTimes.grid.columns.playerName"),
            sortable: true,
            filter: true,
            cellRenderer: (p: { data: SplitTime }) => <span>{p.data.name}</span>,
        },
        {
            field: "lastName",
            resizable: true,
            headerName: t("pages.splitTimes.grid.columns.playerLastName"),
            sortable: true,
            filter: true,
            cellRenderer: (p: { data: SplitTime }) => <span>{p.data.lastName}</span>,
        },
        ...timingPointsOrder
            .map(id => timingPoints.find(tp => tp.id === id)!)!
            .map(tp => ({
                field: tp.name as any,
                headerName: tp.name,
                resizable: true,
                cellRenderer: (p: { data: SplitTime }) => (
                    <SplitTimeResult
                        openEditDialog={openEditDialog}
                        openResetDialog={openRevertDialog}
                        splitTimeResult={p.data}
                        timingPointId={tp.id}
                    />
                ),
            })),
    ];

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.api.sizeColumnsToFit();
    }, []);

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
            await updateSplitTimeMutation.mutateAsync({ ...splitTime, raceId: raceId });
            await refetch();
            refreshRow(gridRef, editedSplitTime.bibNumber!);
        }
    };

    const openRevertDialog = async (editedSplitTime: RevertedSplitTime) => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: t("pages.splitTimes.revert.confirmation.title"),
            component: Confirmation,
            props: {
                message: t("pages.splitTimes.revert.confirmation.text"),
            },
        });

        if (confirmed) {
            await revertSplitTimeMutation.mutateAsync(editedSplitTime);
            await refetch();
            refreshRow(gridRef, editedSplitTime.bibNumber);
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
                    <div className="ag-theme-material h-full">
                        <AgGridReact<SplitTime>
                            ref={gridRef}
                            context={{ refetch }}
                            suppressCellFocus={true}
                            suppressAnimationFrame={true}
                            columnDefs={defaultColumns}
                            getRowId={item => item.data.bibNumber!}
                            rowData={splitTimes}
                            onFirstDataRendered={onFirstDataRendered}
                            onGridSizeChanged={onFirstDataRendered}
                        ></AgGridReact>
                    </div>
                )}
            </div>
        </>
    );
};
