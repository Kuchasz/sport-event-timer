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
import { Button } from "components/button";
import { NewPoorActionsItem, PoorActions } from "components/poor-actions";

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

export const TimingPoint = ({ initialTimingPoint }: { initialTimingPoint: TimingPoint }) => {
    const raceId = useCurrentRaceId();

    const { data: accessKeys, refetch: refetchAccessKeys } = trpc.timingPoint.timingPointAccessUrls.useQuery(
        { raceId: raceId, timingPointId: initialTimingPoint.id },
        { initialData: [] },
    );

    const { data: timingPoint, refetch: refetchTimingPoint } = trpc.timingPoint.timingPoint.useQuery(
        { raceId: raceId, timingPointId: initialTimingPoint.id },
        { initialData: initialTimingPoint },
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
        {
            field: "canAccessOthers",
            headerName: t("pages.timingPoints.accessUrls.grid.columns.supervisor"),
            sortable: true,
            cellRenderer: d => (d.canAccessOthers ? "true" : "false"),
        },
        {
            field: "id",
            headerName: t("pages.timingPoints.accessUrls.grid.columns.actions"),
            sortable: false,
            cellRenderer: d => (
                <PoorActions>
                    <PoorConfirmation
                        onAccept={() => deleteAccessKey(d)}
                        title={t("pages.timingPoints.accessUrls.delete.confirmation.title")}
                        message={t("pages.timingPoints.accessUrls.delete.confirmation.text", { name: d.name })}>
                        <NewPoorActionsItem
                            name={t("pages.timingPoints.accessUrls.delete.title")}
                            description={t("pages.timingPoints.accessUrls.delete.description")}
                            iconPath={mdiTrashCanOutline}></NewPoorActionsItem>
                    </PoorConfirmation>

                    <NewPoorActionsItem
                        onClick={generateAccessUrl}
                        name={t("pages.timingPoints.accessUrls.copy.title")}
                        description={t("pages.timingPoints.accessUrls.copy.description")}
                        iconPath={mdiClipboardFileOutline}></NewPoorActionsItem>
                </PoorActions>
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
                <title>{t("pages.timingPoint.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.timingPoint.header.title")} description={t("pages.timingPoint.header.description")} />
                <div className="flex">
                    <div className="mt-1 w-full flex-grow">
                        <div className="flex flex-grow rounded-lg bg-gray-50 p-6">
                            <div className="flex-grow">
                                <h3 className="text-xl font-semibold">{timingPoint.name}</h3>
                                <div>{timingPoint.description}</div>
                            </div>
                            <div className="flex items-center">
                                <PoorModal
                                    onResolve={() => refetchTimingPoint()}
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
                                <PageHeader
                                    title={t("pages.timingPoints.accessUrls.header.title")}
                                    description={t("pages.timingPoints.accessUrls.header.description")}
                                />
                            </div>
                            <div className="p-2"></div>
                            <PoorModal
                                onResolve={() => refetchAccessKeys()}
                                title={t("pages.timingPoints.accessUrls.create.title")}
                                component={TimingPointAccessUrlCreate}
                                componentProps={{
                                    timingPointId: timingPoint.id,
                                    raceId: timingPoint.raceId,
                                    onReject: () => {},
                                }}>
                                <Button outline>
                                    <Icon size={0.8} path={mdiPlus} />
                                    <span className="ml-2">{t("pages.timingPoints.accessUrls.create.button")}</span>
                                </Button>
                            </PoorModal>
                            <div className="p-2"></div>
                            <PoorDataTable columns={cols} getRowId={d => d.id} gridName="timing-point-access-keys" data={accessKeys} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
