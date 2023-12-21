"use client";

import { mdiClipboardFileOutline, mdiPencilOutline, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { PageHeader } from "components/page-header";
import { TimingPointAccessUrlCreate } from "components/panel/timing-point/timing-point-access-url-create-form";
import { PoorConfirmation, PoorModal } from "components/poor-modal";

import { TimingPointEdit } from "components/panel/timing-point/timing-point-edit";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { useTranslations } from "next-intl";
import Head from "next/head";
import type { AppRouterOutputs } from "trpc";
import { useCurrentRaceId } from "../../../../../../hooks";
import { trpc } from "../../../../../../trpc-core";

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

export const TimingPoint = ({ timingPoint }: { timingPoint: TimingPoint }) => {
    const raceId = useCurrentRaceId();

    const { data: accessKeys, refetch: refetchAccessKeys } = trpc.timingPoint.timingPointAccessUrls.useQuery(
        { raceId: raceId, timingPointId: timingPoint.id },
        { initialData: [] },
    );
    const t = useTranslations();

    const deleteTimingPointMutation = trpc.timingPoint.delete.useMutation();
    const deleteTimingPointAccessKeyMutation = trpc.timingPoint.deleteTimingPointAccessUrl.useMutation();

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
                <PoorConfirmation
                    onAccept={() => deleteAccessKey(d)}
                    title={t("pages.timingPoints.accessUrls.delete.confirmation.title")}
                    message={t("pages.timingPoints.accessUrls.delete.confirmation.text", { name: d.name })}>
                    <button className="font-medium hover:text-red-600 hover:underline">
                        <Icon path={mdiTrashCanOutline} size={0.8}></Icon>
                    </button>
                </PoorConfirmation>
            ),
        },
    ];

    const deleteTimingPoint = async (timingPoint: TimingPoint) => {
        await deleteTimingPointMutation.mutateAsync(timingPoint);

        // void refetchOrder();
        // void refetchTimingPoints();
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
                    <div className="ml-8 mt-1 w-full flex-grow">
                        <div className="flex flex-grow rounded-lg bg-gray-50 p-6">
                            <div className="flex-grow">
                                <h3 className="text-xl font-semibold">{timingPoint.name}</h3>
                                <div>{timingPoint.description}</div>
                            </div>
                            <div className="flex items-center">
                                <PoorModal
                                    onResolve={() => {}}
                                    title={t("pages.timingPoints.edit.title")}
                                    component={TimingPointEdit}
                                    componentProps={{
                                        editedTimingPoint: timingPoint,
                                        onReject: () => {},
                                    }}>
                                    <button className="rounded-lg p-3 text-gray-600 hover:bg-gray-100">
                                        <Icon path={mdiPencilOutline} size={0.8}></Icon>
                                    </button>
                                </PoorModal>
                                <PoorConfirmation
                                    onAccept={() => deleteTimingPoint(timingPoint)}
                                    title={t("pages.timingPoints.delete.confirmation.title")}
                                    message={t("pages.timingPoints.delete.confirmation.text", { name: timingPoint.name })}>
                                    <button className="ml-2 rounded-lg p-3 text-gray-600 hover:bg-gray-100">
                                        <Icon path={mdiTrashCanOutline} size={0.8}></Icon>
                                    </button>
                                </PoorConfirmation>
                            </div>
                        </div>
                        <div className="mt-8">
                            <div className="flex items-center">
                                <div>
                                    <h3 className="text-xl font-semibold">{t("pages.timingPoints.accessUrls.header.title")}</h3>
                                    <div>{t("pages.timingPoints.accessUrls.header.description")}</div>
                                </div>
                                <div className="flex-grow"></div>
                                <PoorModal
                                    onResolve={() => refetchAccessKeys()}
                                    title={t("pages.timingPoints.accessUrls.create.title")}
                                    component={TimingPointAccessUrlCreate}
                                    componentProps={{
                                        timingPointId: timingPoint.id,
                                        raceId: timingPoint.raceId,
                                        onReject: () => {},
                                    }}>
                                    <button className="rounded-lg bg-gray-100 p-3 text-gray-600 hover:bg-gray-200">
                                        <Icon path={mdiPlus} size={0.8}></Icon>
                                    </button>
                                </PoorModal>
                            </div>
                            <PoorDataTable columns={cols} getRowId={d => d.id} gridName="timing-point-access-keys" data={accessKeys} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
