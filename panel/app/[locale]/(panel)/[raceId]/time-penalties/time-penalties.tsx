"use client";
import { mdiExport, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { PageHeader } from "components/page-header";
import { NewPoorActionsItem, PoorActions } from "components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { useTranslations } from "next-intl";
import Head from "next/head";
import type { AppRouterOutputs } from "trpc";
import { PoorConfirmation } from "../../../../../components/poor-modal";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type TimePenalty = AppRouterOutputs["timePenalty"]["allPenalties"][0];
type Disqualification = AppRouterOutputs["disqualification"]["allDisqualifications"][0];

const PlayerActions = ({ penalty, refetch }: { penalty: TimePenalty; refetch: () => void }) => {
    const revertTimePenaltyMutation = trpc.timePenalty.revert.useMutation();
    const t = useTranslations();
    const revertTimePenalty = async () => {
        await revertTimePenaltyMutation.mutateAsync({ id: penalty.id });
        refetch();
    };

    return (
        <PoorActions>
            {/* <PoorModal
                title={t("timeMeasurement.timePenalty.page.edit.title")}
                component={PlayerEdit}
                componentProps={{
                    raceId: penalty.raceId,
                    editedPlayer: penalty,
                    onReject: () => {},
                }}
                onResolve={refetch}>
                <NewPoorActionsItem
                    name={t("timeMeasurement.timePenalty.page.edit.name")}
                    description={t("timeMeasurement.timePenalty.page.edit.description")}
                    iconPath={mdiHumanEdit}></NewPoorActionsItem>
            </PoorModal> */}
            <PoorConfirmation
                title={t("timeMeasurement.timePenalty.page.revert.confirmation.title")}
                message={t("timeMeasurement.timePenalty.page.revert.confirmation.text", {
                    player: penalty.player,
                })}
                onAccept={revertTimePenalty}>
                <NewPoorActionsItem
                    name={t("timeMeasurement.timePenalty.page.revert.name")}
                    description={t("timeMeasurement.timePenalty.page.revert.description")}
                    iconPath={mdiTrashCanOutline}></NewPoorActionsItem>
            </PoorConfirmation>
        </PoorActions>
    );
};

export const TimePenalties = () => {
    const raceId = useCurrentRaceId();
    const t = useTranslations();
    const { data: timePenalties, refetch: refetchTimePenalties } = trpc.timePenalty.allPenalties.useQuery({ raceId: raceId });
    const { data: disqualifications, refetch: refetchDisqualifications } = trpc.disqualification.allDisqualifications.useQuery({
        raceId: raceId,
    });

    const timePenaltiesCols: PoorDataTableColumn<TimePenalty>[] = [
        {
            field: "bibNumber",
            headerName: t("timeMeasurement.timePenalty.page.grid.columns.bibNumber"),
            sortable: true,
        },
        {
            field: "time",
            headerName: t("timeMeasurement.timePenalty.page.grid.columns.time"),
            sortable: false,
        },
        {
            field: "reason",
            headerName: t("timeMeasurement.timePenalty.page.grid.columns.reason"),
            sortable: true,
        },
        {
            field: "player",
            headerName: t("timeMeasurement.timePenalty.page.grid.columns.player"),
            sortable: true,
        },
        {
            headerName: t("timeMeasurement.timePenalty.page.grid.columns.actions"),
            field: "bibNumber",
            sortable: false,
            cellRenderer: data => <PlayerActions refetch={refetchTimePenalties} penalty={data} />,
        },
    ];

    const disqualificationCols: PoorDataTableColumn<Disqualification>[] = [
        {
            field: "bibNumber",
            headerName: t("timeMeasurement.timePenalty.page.disqualification.grid.columns.bibNumber"),
            sortable: true,
        },
        {
            field: "reason",
            headerName: t("timeMeasurement.timePenalty.page.disqualification.grid.columns.reason"),
            sortable: true,
        },
        {
            field: "player",
            headerName: t("timeMeasurement.timePenalty.page.disqualification.grid.columns.player"),
            sortable: true,
        },
        // {
        //     headerName: t("timeMeasurement.timePenalty.page.grid.columns.actions"),
        //     field: "bibNumber",
        //     sortable: false,
        //     cellRenderer: data => <PlayerActions refetch={refetchTimePenalties} penalty={data} />,
        // },
    ];

    return (
        <>
            <Head>
                <title>{t("timeMeasurement.timePenalty.page.header.title")}</title>
            </Head>

            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader
                    title={t("timeMeasurement.timePenalty.page.header.title")}
                    description={t("timeMeasurement.timePenalty.page.header.description")}
                />
                <div className="mb-4 flex">
                    <Button
                        outline
                        onClick={() => {
                            alert("It does not work now!");
                            // gridRef.current?.api.exportDataAsCsv({
                            //     fileName: `players-${new Date().toLocaleDateString(locale)}.csv`,
                            // });
                        }}>
                        <Icon size={0.8} path={mdiExport} />
                        <span className="ml-2">{t("timeMeasurement.timePenalty.page.export.button")}</span>
                    </Button>
                </div>

                {timePenalties && (
                    <div className="flex-grow">
                        <PoorDataTable
                            data={timePenalties}
                            columns={timePenaltiesCols}
                            searchPlaceholder={t("timeMeasurement.timePenalty.page.grid.search.placeholder")}
                            getRowId={item => item.id}
                            gridName="time-penalties"
                            searchFields={["reason", "time", "bibNumber", "player"]}
                        />
                    </div>
                )}
                <PageHeader
                    title={t("timeMeasurement.timePenalty.page.disqualification.header.title")}
                    description={t("timeMeasurement.timePenalty.page.disqualification.header.description")}
                />
                <div className="mb-4 flex">
                    <Button
                        outline
                        onClick={() => {
                            alert("It does not work now!");
                        }}>
                        <Icon size={0.8} path={mdiExport} />
                        <span className="ml-2">{t("timeMeasurement.timePenalty.page.disqualification.export.button")}</span>
                    </Button>
                </div>

                {disqualifications && (
                    <div className="flex-grow">
                        <PoorDataTable
                            data={disqualifications}
                            columns={disqualificationCols}
                            searchPlaceholder={t("timeMeasurement.timePenalty.page.disqualification.grid.search.placeholder")}
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
