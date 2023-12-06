"use client";

import { mdiClipboardFileOutline, mdiPencilOutline, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { ConfirmationModal, ModalModal } from "components/modal";
import { PageHeader } from "components/page-header";
import { TimingPointAccessUrlCreate } from "components/panel/timing-point/timing-point-access-url-create-form";
import { TimingPointCreate } from "components/panel/timing-point/timing-point-create";
import { TimingPointEdit } from "components/panel/timing-point/timing-point-edit";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useState } from "react";
import type { AppRouterOutputs } from "trpc";
import { getTimingPointIcon } from "utils";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];
type AccessKeys = AppRouterOutputs["timingPoint"]["timingPointAccessUrls"];
type AccessKey = AppRouterOutputs["timingPoint"]["timingPointAccessUrls"][0];

const generateAccessUrl = async () => {
    const { csrfToken } = await fetch("/api/auth/csrf").then(r => r.json());

    await fetch("/api/auth/signin/email", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
            csrfToken,
            email: "@",
        }),
    });
};

const TimingPointCard = ({
    onCreate,
    onSelect,
    index,
    raceId,
    isActive,
    timingPoint,
    isFirst,
    isLast,
}: {
    onCreate: () => void;
    onSelect: (timingPointId: number) => void;
    index: number;
    raceId: number;
    isActive: boolean;
    isFirst: boolean;
    isLast: boolean;
    timingPoint: TimingPoint;
}) => {
    const t = useTranslations();

    return (
        <div className="flex flex-col">
            {!isFirst && (
                <div className="flex flex-col items-center">
                    <div className="h-5 w-0.5 bg-gray-100"></div>
                    <ModalModal
                        onResolve={onCreate}
                        title={t("pages.timingPoints.create.title")}
                        component={TimingPointCreate}
                        componentProps={{ raceId: raceId, index, onReject: () => {} }}>
                        <button className="my-1 flex cursor-pointer items-center self-center rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-600">
                            <Icon path={mdiPlus} size={0.7} />
                            <span className="ml-1.5">{t("pages.timingPoints.create.button")}</span>
                        </button>
                    </ModalModal>
                    <div className="h-5 w-0.5 bg-gray-100"></div>
                </div>
            )}

            <div
                onClick={() => onSelect(timingPoint.id)}
                className="my-1 w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#c2e59c] to-[#64b3f4] p-1">
                <div className={classNames("flex rounded-lg px-6 py-4", { ["bg-white"]: !isActive })}>
                    <div className={classNames(`mr-4 self-center rounded-full bg-gray-100 p-2 text-gray-500`, { ["rotate-90"]: !isLast })}>
                        <Icon path={getTimingPointIcon(isFirst, isLast)} size={0.8} />
                    </div>
                    <div className="flex flex-col">
                        <h4 className={classNames("text-md font-bold", { ["text-white"]: isActive })}>{timingPoint.name}</h4>
                        <span className={classNames("text-sm", { ["text-white"]: isActive, ["text-gray-500"]: !isActive })}>
                            {timingPoint.description ?? "Timing point where time should be registered"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TimingPoints = () => {
    const raceId = useCurrentRaceId();
    const [activeTimingPointId, setActiveTimingPointId] = useState<number>(38);
    const { data: timingPoints, refetch: refetchTimingPoints } = trpc.timingPoint.timingPoints.useQuery(
        { raceId: raceId },
        { initialData: [] },
    );
    const { data: accessKeys, refetch: refetchAccessKeys } = trpc.timingPoint.timingPointAccessUrls.useQuery(
        { raceId: raceId, timingPointId: activeTimingPointId },
        { initialData: [] },
    );
    const t = useTranslations();

    const deleteTimingPointMutation = trpc.timingPoint.delete.useMutation();
    const deleteTimingPointAccessKeyMutation = trpc.timingPoint.deleteTimingPointAccessUrl.useMutation();

    const { data: timingPointsOrder, refetch: refetchOrder } = trpc.timingPoint.timingPointsOrder.useQuery(
        { raceId: raceId },
        {
            initialData: [],
        },
    );

    const sortedTimingPoints = timingPointsOrder.map(point => timingPoints.find(tp => point === tp.id)!);
    const activeTimingPoint = sortedTimingPoints.find(tp => tp.id === activeTimingPointId);

    const cols: PoorDataTableColumn<AccessKey>[] = [
        { field: "name", headerName: t("pages.timingPoints.accessUrls.grid.columns.keyName"), sortable: true },
        {
            field: "expireDate",
            headerName: t("pages.timingPoints.accessUrls.grid.columns.expiresAt"),
            sortable: false,
            cellRenderer: d => d.expireDate.toLocaleString(),
        },
        { field: "code", headerName: t("pages.timingPoints.accessUrls.grid.columns.code"), sortable: true },
        {
            field: "canAccessOthers",
            headerName: t("pages.timingPoints.accessUrls.grid.columns.supervisor"),
            sortable: true,
            cellRenderer: d => (d.canAccessOthers ? "true" : "false"),
        },
        { field: "token", headerName: t("pages.timingPoints.accessUrls.grid.columns.token"), sortable: true },
        {
            field: "id",
            headerName: t("pages.timingPoints.accessUrls.grid.columns.url"),
            sortable: false,
            cellRenderer: d => (
                <div>
                    <span>http://app.url/{d.token}</span>
                    <button onClick={generateAccessUrl} className="hover:text-blue-600">
                        <Icon className="ml-2" path={mdiClipboardFileOutline} size={0.8}></Icon>
                    </button>
                </div>
            ),
        },
        {
            field: "id",
            headerName: t("pages.timingPoints.accessUrls.edit.button"),
            sortable: false,
            cellRenderer: d => (
                <ConfirmationModal
                    onAccept={() => deleteAccessKey(d)}
                    title={t("pages.timingPoints.accessUrls.delete.confirmation.title")}
                    message={t("pages.timingPoints.accessUrls.delete.confirmation.text", { name: d.name })}>
                    <button className="font-medium hover:text-red-600 hover:underline">
                        <Icon path={mdiTrashCanOutline} size={0.8}></Icon>
                    </button>
                </ConfirmationModal>
            ),
        },
    ];

    const deleteTimingPoint = async (timingPoint: TimingPoint) => {
        await deleteTimingPointMutation.mutateAsync(timingPoint);

        void refetchOrder();
        void refetchTimingPoints();
    };

    const deleteAccessKey = async (timingPointAccessKey: AccessKeys[0]) => {
        await deleteTimingPointAccessKeyMutation.mutateAsync({ timingPointAccessUrlId: timingPointAccessKey.id });

        void refetchAccessKeys();
    };

    return (
        <>
            <Head>
                <title>{t("pages.timingPoints.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.timingPoints.header.title")} description={t("pages.timingPoints.header.description")} />
                <div className="flex">
                    <div className="w-full max-w-md ">
                        {sortedTimingPoints?.map((e, index) => (
                            <TimingPointCard
                                key={e.id}
                                index={index}
                                raceId={raceId}
                                onCreate={() => {
                                    void refetchTimingPoints();
                                    void refetchOrder();
                                }}
                                onSelect={setActiveTimingPointId}
                                isActive={e.id === activeTimingPointId}
                                timingPoint={e}
                                isFirst={index === 0}
                                isLast={index === sortedTimingPoints.length - 1}
                            />
                        ))}
                    </div>
                    {activeTimingPoint && (
                        <div className="ml-8 mt-1 w-full flex-grow">
                            <div className="flex flex-grow rounded-lg bg-gray-50 p-6">
                                <div className="flex-grow">
                                    <h3 className="text-xl font-semibold">{activeTimingPoint.name}</h3>
                                    <div>{activeTimingPoint.description}</div>
                                </div>
                                <div className="flex items-center">
                                    <ModalModal
                                        onResolve={() => refetchTimingPoints()}
                                        title={t("pages.timingPoints.edit.title")}
                                        component={TimingPointEdit}
                                        componentProps={{
                                            editedTimingPoint: activeTimingPoint,
                                            onReject: () => {},
                                        }}>
                                        <button className="rounded-lg p-3 text-gray-600 hover:bg-gray-100">
                                            <Icon path={mdiPencilOutline} size={0.8}></Icon>
                                        </button>
                                    </ModalModal>
                                    <ConfirmationModal
                                        onAccept={() => deleteTimingPoint(activeTimingPoint)}
                                        title={t("pages.timingPoints.delete.confirmation.title")}
                                        message={t("pages.timingPoints.delete.confirmation.text", { name: activeTimingPoint.name })}>
                                        <button className="ml-2 rounded-lg p-3 text-gray-600 hover:bg-gray-100">
                                            <Icon path={mdiTrashCanOutline} size={0.8}></Icon>
                                        </button>
                                    </ConfirmationModal>
                                </div>
                            </div>
                            <div className="mt-8">
                                <div className="flex items-center">
                                    <div>
                                        <h3 className="text-xl font-semibold">{t("pages.timingPoints.accessUrls.header.title")}</h3>
                                        <div>{t("pages.timingPoints.accessUrls.header.description")}</div>
                                    </div>
                                    <div className="flex-grow"></div>
                                    <ModalModal
                                        onResolve={() => refetchAccessKeys()}
                                        title={t("pages.timingPoints.accessUrls.create.title")}
                                        component={TimingPointAccessUrlCreate}
                                        componentProps={{
                                            timingPointId: activeTimingPoint.id,
                                            raceId: activeTimingPoint.raceId,
                                            onReject: () => {},
                                        }}>
                                        <button className="rounded-lg bg-gray-100 p-3 text-gray-600 hover:bg-gray-200">
                                            <Icon path={mdiPlus} size={0.8}></Icon>
                                        </button>
                                    </ModalModal>
                                </div>
                                <PoorDataTable columns={cols} getRowId={d => d.id} gridName="timing-point-access-keys" data={accessKeys} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
