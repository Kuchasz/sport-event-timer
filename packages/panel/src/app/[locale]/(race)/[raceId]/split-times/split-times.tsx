"use client";

import { mdiAlertCircleOutline, mdiClockEditOutline, mdiClockPlusOutline, mdiReload } from "@mdi/js";
import Icon from "@mdi/react";
import { createRange } from "@set/utils/dist/array";
import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { PageHeader } from "src/components/page-headers";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { PoorConfirmation, PoorModal } from "src/components/poor-modal";
import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
import { SplitTimeEdit } from "../../../../../components/panel/split-time/split-time-edit";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";
import { Tooltip, TooltipContent, TooltipTrigger } from "src/components/tooltip";

type SplitTime = AppRouterOutputs["splitTime"]["splitTimes"][0];
type RevertedSplitTime = AppRouterInputs["splitTime"]["revert"];

type SplitTimeResultTypes = {
    openResetDialog: (params: RevertedSplitTime) => Promise<void>;
    isLoading: boolean;
    splitTime?: { time: number; manual: boolean };
    bibNumber: string;
    refetch: () => void;
    raceId: number;
    raceDate: Date;
    timingPointId: number;
    lap: number;
};
const SplitTimeResult = ({
    refetch,
    isLoading,
    raceId,
    raceDate,
    openResetDialog,
    splitTime,
    bibNumber,
    lap,
    timingPointId,
}: SplitTimeResultTypes) => {
    const t = useTranslations();
    return (
        <div className={classNames("flex font-mono", splitTime?.manual ? "" : "")}>
            <span>{formatTimeWithMilliSec(splitTime?.time)}</span>
            <div className="flex-grow"></div>
            {splitTime && splitTime.time > 0 && (
                <PoorModal
                    onResolve={refetch}
                    title={t("pages.splitTimes.edit.title")}
                    component={SplitTimeEdit}
                    componentProps={{
                        editedSplitTime: {
                            bibNumber,
                            time: splitTime?.time,
                            lap,
                            timingPointId: timingPointId,
                            raceId,
                        },
                        raceId,
                        raceDate: raceDate.getTime(),
                        onReject: () => {},
                    }}>
                    <span className="ml-2 flex cursor-pointer items-center hover:text-red-600">
                        <Icon size={0.75} path={mdiClockEditOutline} />
                    </span>
                </PoorModal>
            )}
            {splitTime == null && (
                <PoorModal
                    onResolve={refetch}
                    title={t("pages.splitTimes.edit.title")}
                    component={SplitTimeEdit}
                    componentProps={{
                        editedSplitTime: {
                            bibNumber,
                            time: 0,
                            timingPointId: timingPointId,
                            lap,
                            raceId,
                        },
                        raceId,
                        raceDate: raceDate.getTime(),
                        onReject: () => {},
                    }}>
                    <span className="ml-2 flex cursor-pointer items-center hover:text-red-600">
                        <Icon size={0.75} path={mdiClockPlusOutline} />
                    </span>
                </PoorModal>
            )}
            {splitTime?.manual == true ? (
                <PoorConfirmation
                    title={t("pages.splitTimes.revert.confirmation.title")}
                    message={t("pages.splitTimes.revert.confirmation.text")}
                    onAccept={() =>
                        openResetDialog({
                            bibNumber,
                            lap,
                            timingPointId: timingPointId,
                        })
                    }
                    isLoading={isLoading}>
                    <span className="ml-2 flex cursor-pointer items-center hover:text-red-600">
                        <Icon size={0.75} path={mdiReload} />
                    </span>
                </PoorConfirmation>
            ) : (
                <span className="ml-2 flex opacity-10">
                    <Icon size={0.75} path={mdiReload} />
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
            field: "hasError",
            headerName: "",
            sortable: false,
            cellRenderer: data =>
                data.hasError ? (
                    <Tooltip>
                        <TooltipTrigger>
                            <Icon size={0.8} path={mdiAlertCircleOutline} className="rounded-full bg-red-100 text-red-500"></Icon>
                        </TooltipTrigger>
                        <TooltipContent>{t("pages.splitTimes.grid.columns.status.error")}</TooltipContent>
                    </Tooltip>
                ) : data.hasWarning ? (
                    <Tooltip>
                        <TooltipTrigger>
                            <Icon size={0.8} path={mdiAlertCircleOutline} className="rounded-full bg-orange-100 text-orange-500"></Icon>
                        </TooltipTrigger>
                        <TooltipContent>{t("pages.splitTimes.grid.columns.status.warning")}</TooltipContent>
                    </Tooltip>
                ) : null,
        },
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
            .flatMap(tp =>
                createRange({ from: 0, to: tp.laps ?? 0 }).map((_, lap) => ({
                    field: `times.${tp.id}.${lap}.time` as any,
                    headerName: tp.laps ? `${tp.name}(${lap + 1})` : tp.name,
                    sortable: true,
                    cellRenderer: (data: SplitTime) => (
                        <SplitTimeResult
                            refetch={() => refetch()}
                            raceId={raceId}
                            raceDate={race?.date ?? new Date()}
                            openResetDialog={revertManualSplitTime}
                            bibNumber={data.bibNumber}
                            splitTime={data.times[tp.id]?.[lap]}
                            timingPointId={tp.id}
                            isLoading={revertSplitTimeMutation.isLoading}
                            lap={lap}
                        />
                    ),
                })),
            ),
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
                            // getRowStyle={item =>
                            //     item.hasError ? "bg-red-100 text-red-500" : item.hasWarning ? "bg-orange-100 text-orange-500" : ""
                            // }
                            gridName="split-times"
                            searchFields={["name", "lastName", "bibNumber"]}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
