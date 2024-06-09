"use client";
import { mdiExport, mdiPencil, mdiPlus, mdiRestore } from "@mdi/js";
import Icon from "@mdi/react";
import { formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";
import { PoorButton } from "src/components/poor-button";
import { PageHeader } from "src/components/page-headers";
import { DisqualificationCreate } from "src/components/panel/penalties/disqualification-create";
import { DisqualificationEdit } from "src/components/panel/penalties/disqualification-edit";
import { TimePenaltyCreate } from "src/components/panel/penalties/time-penalty-create";
import { TimePenaltyEdit } from "src/components/panel/penalties/time-penalty-edit";
import { NewPoorActionsItem, PoorActions } from "src/components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { useTranslations } from "next-intl";
import Head from "next/head";
import type { AppRouterOutputs } from "src/trpc";
import { PoorConfirmation, PoorModal } from "../../../../../components/poor-modal";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type TimePenalty = AppRouterOutputs["timePenalty"]["allPenalties"][0];
type Disqualification = AppRouterOutputs["disqualification"]["allDisqualifications"][0];

const TimePenaltyActions = ({ penalty, refetch }: { penalty: TimePenalty; refetch: () => void }) => {
    const revertTimePenaltyMutation = trpc.timePenalty.revert.useMutation();
    const t = useTranslations();
    const revertTimePenalty = async () => {
        await revertTimePenaltyMutation.mutateAsync({ id: penalty.id });
        refetch();
    };

    return (
        <PoorActions>
            <PoorModal
                title={t("timeMeasurement.penalties.page.timePenalty.edit.confirmation.title")}
                description={t("timeMeasurement.penalties.page.timePenalty.edit.confirmation.description")}
                component={TimePenaltyEdit}
                componentProps={{
                    editedTimePenalty: penalty,
                    onReject: () => {},
                }}
                onResolve={refetch}>
                <NewPoorActionsItem
                    name={t("timeMeasurement.penalties.page.timePenalty.edit.name")}
                    description={t("timeMeasurement.penalties.page.timePenalty.edit.description")}
                    iconPath={mdiPencil}></NewPoorActionsItem>
            </PoorModal>
            <PoorConfirmation
                destructive
                title={t("timeMeasurement.penalties.page.timePenalty.revert.confirmation.title")}
                message={t("timeMeasurement.penalties.page.timePenalty.revert.confirmation.text", {
                    player: penalty.player,
                })}
                onAccept={revertTimePenalty}
                isLoading={revertTimePenaltyMutation.isLoading}>
                <NewPoorActionsItem
                    name={t("timeMeasurement.penalties.page.timePenalty.revert.name")}
                    description={t("timeMeasurement.penalties.page.timePenalty.revert.description")}
                    iconPath={mdiRestore}></NewPoorActionsItem>
            </PoorConfirmation>
        </PoorActions>
    );
};

const DisqualificationActions = ({ disqualification, refetch }: { disqualification: Disqualification; refetch: () => void }) => {
    const revertDisqualificationMutation = trpc.disqualification.revert.useMutation();
    const t = useTranslations();
    const revertDisqualification = async () => {
        await revertDisqualificationMutation.mutateAsync({ id: disqualification.id });
        refetch();
    };

    return (
        <PoorActions>
            <PoorModal
                title={t("timeMeasurement.penalties.page.disqualification.edit.confirmation.title")}
                description={t("timeMeasurement.penalties.page.disqualification.edit.confirmation.description")}
                component={DisqualificationEdit}
                componentProps={{
                    editedDisqualification: disqualification,
                    onReject: () => {},
                }}
                onResolve={refetch}>
                <NewPoorActionsItem
                    name={t("timeMeasurement.penalties.page.disqualification.edit.name")}
                    description={t("timeMeasurement.penalties.page.disqualification.edit.description")}
                    iconPath={mdiPencil}></NewPoorActionsItem>
            </PoorModal>
            <PoorConfirmation
                destructive
                title={t("timeMeasurement.penalties.page.disqualification.revert.confirmation.title")}
                message={t("timeMeasurement.penalties.page.disqualification.revert.confirmation.text", {
                    player: disqualification.player,
                })}
                onAccept={revertDisqualification}
                isLoading={revertDisqualificationMutation.isLoading}>
                <NewPoorActionsItem
                    name={t("timeMeasurement.penalties.page.disqualification.revert.name")}
                    description={t("timeMeasurement.penalties.page.disqualification.revert.description")}
                    iconPath={mdiRestore}></NewPoorActionsItem>
            </PoorConfirmation>
        </PoorActions>
    );
};

export const Penalties = () => {
    const raceId = useCurrentRaceId();
    const t = useTranslations();
    const { data: timePenalties, refetch: refetchTimePenalties } = trpc.timePenalty.allPenalties.useQuery({ raceId: raceId });
    const { data: disqualifications, refetch: refetchDisqualifications } = trpc.disqualification.allDisqualifications.useQuery({
        raceId: raceId,
    });

    const timePenaltiesCols: PoorDataTableColumn<TimePenalty>[] = [
        {
            field: "bibNumber",
            headerName: t("timeMeasurement.penalties.page.grid.columns.bibNumber"),
            sortable: true,
        },
        {
            field: "time",
            headerName: t("timeMeasurement.penalties.page.grid.columns.time"),
            sortable: false,
            cellRenderer: data => <span>{formatTimeWithMilliSecUTC(data.time)}</span>,
        },
        {
            field: "reason",
            headerName: t("timeMeasurement.penalties.page.grid.columns.reason"),
            sortable: true,
        },
        {
            field: "player",
            headerName: t("timeMeasurement.penalties.page.grid.columns.player"),
            sortable: true,
        },
        {
            headerName: t("timeMeasurement.penalties.page.grid.columns.actions"),
            field: "actions",
            allowShrink: true,
            cellRenderer: data => <TimePenaltyActions refetch={refetchTimePenalties} penalty={data} />,
        },
    ];

    const disqualificationCols: PoorDataTableColumn<Disqualification>[] = [
        {
            field: "bibNumber",
            headerName: t("timeMeasurement.penalties.page.disqualification.grid.columns.bibNumber"),
            sortable: true,
        },
        {
            field: "reason",
            headerName: t("timeMeasurement.penalties.page.disqualification.grid.columns.reason"),
            sortable: true,
        },
        {
            field: "player",
            headerName: t("timeMeasurement.penalties.page.disqualification.grid.columns.player"),
            sortable: true,
        },
        {
            headerName: t("timeMeasurement.penalties.page.grid.columns.actions"),
            field: "actions",
            allowShrink: true,
            cellRenderer: data => <DisqualificationActions refetch={refetchDisqualifications} disqualification={data} />,
        },
    ];

    return (
        <>
            <Head>
                <title>{t("timeMeasurement.penalties.page.header.title")}</title>
            </Head>

            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader
                    title={t("timeMeasurement.penalties.page.header.title")}
                    description={t("timeMeasurement.penalties.page.header.description")}
                />
                <div className="mb-4 flex">
                    <PoorModal
                        onResolve={() => refetchTimePenalties()}
                        title={t("timeMeasurement.penalties.timePenalty.create.confirmation.title")}
                        description={t("timeMeasurement.penalties.timePenalty.create.confirmation.text")}
                        component={TimePenaltyCreate}
                        componentProps={{
                            onReject: () => {},
                        }}>
                        <PoorButton outline>
                            <Icon size={0.8} path={mdiPlus} />
                            <span className="ml-2">{t("timeMeasurement.penalties.timePenalty.create.button")}</span>
                        </PoorButton>
                    </PoorModal>
                    <PoorButton
                        className="ml-2"
                        outline
                        onClick={() => {
                            alert("It does not work now!");
                            // gridRef.current?.api.exportDataAsCsv({
                            //     fileName: `players-${new Date().toLocaleDateString(locale)}.csv`,
                            // });
                        }}>
                        <Icon size={0.8} path={mdiExport} />
                        <span className="ml-2">{t("timeMeasurement.penalties.page.export.button")}</span>
                    </PoorButton>
                </div>

                {timePenalties && (
                    <div className="flex-grow">
                        <PoorDataTable
                            hideColumnsChooser
                            data={timePenalties}
                            columns={timePenaltiesCols}
                            searchPlaceholder={t("timeMeasurement.penalties.page.grid.search.placeholder")}
                            getRowId={item => item.id}
                            gridName="time-penalties"
                            searchFields={["reason", "time", "bibNumber", "player"]}
                        />
                    </div>
                )}
                <PageHeader
                    title={t("timeMeasurement.penalties.page.disqualification.header.title")}
                    description={t("timeMeasurement.penalties.page.disqualification.header.description")}
                />
                <div className="mb-4 flex">
                    <PoorModal
                        onResolve={() => refetchDisqualifications()}
                        title={t("timeMeasurement.penalties.page.disqualification.create.confirmation.title")}
                        description={t("timeMeasurement.penalties.page.disqualification.create.confirmation.text")}
                        component={DisqualificationCreate}
                        componentProps={{
                            onReject: () => {},
                        }}>
                        <PoorButton outline>
                            <Icon size={0.8} path={mdiPlus} />
                            <span className="ml-2">{t("timeMeasurement.penalties.page.disqualification.create.button")}</span>
                        </PoorButton>
                    </PoorModal>
                    <PoorButton
                        className="ml-2"
                        outline
                        onClick={() => {
                            alert("It does not work now!");
                        }}>
                        <Icon size={0.8} path={mdiExport} />
                        <span className="ml-2">{t("timeMeasurement.penalties.page.disqualification.export.button")}</span>
                    </PoorButton>
                </div>

                {disqualifications && (
                    <div className="flex-grow">
                        <PoorDataTable
                            hideColumnsChooser
                            data={disqualifications}
                            columns={disqualificationCols}
                            searchPlaceholder={t("timeMeasurement.penalties.page.disqualification.grid.search.placeholder")}
                            getRowId={item => item.id}
                            gridName="disqualifications"
                            searchFields={["reason", "bibNumber", "player"]}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
