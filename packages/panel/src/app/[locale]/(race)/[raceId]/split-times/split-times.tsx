"use client";

import { mdiClockEditOutline, mdiReload } from "@mdi/js";
import Icon from "@mdi/react";
import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { PageHeader } from "src/components/page-headers";
import { SplitTimeEdit } from "src/components/panel/split-time/split-time-edit";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { PoorConfirmation, PoorModal } from "src/components/poor-modal";
import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

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
    splitId: number;
    classificationId: number;
};
const SplitTimeResult = ({
    refetch,
    isLoading,
    raceId,
    raceDate,
    openResetDialog,
    splitTime,
    bibNumber,
    splitId,
    classificationId,
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
                            splitId,
                            raceId,
                        },
                        raceId,
                        classificationId,
                        raceDate: raceDate.getTime(),
                        onReject: () => {},
                    }}>
                    <span className="ml-2 flex cursor-pointer items-center hover:text-red-600">
                        <Icon size={0.75} path={mdiClockEditOutline} />
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
                            splitId,
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
