"use client";
import { mdiExport, mdiHumanEdit, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { PageHeader } from "components/page-header";
import { PlayerEdit } from "components/panel/player/player-edit";
import { NewPoorActionsItem, PoorActions } from "components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { useTranslations } from "next-intl";
import Head from "next/head";
import type { AppRouterOutputs } from "trpc";
import { PoorConfirmation, PoorModal } from "../../../../../components/poor-modal";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type TimePenalty = AppRouterOutputs["timePenalty"]["allPenalties"][0];

const PlayerActions = ({ player, refetch }: { player: TimePenalty; refetch: () => void }) => {
    const deletePlayerMutation = trpc.player.delete.useMutation();
    const t = useTranslations();
    const deletePlayer = async () => {
        await deletePlayerMutation.mutateAsync({ playerId: player.id });
        refetch();
    };

    return (
        <PoorActions>
            {/* <PoorModal
                title={t("pages.players.edit.title")}
                component={PlayerEdit}
                componentProps={{
                    raceId: player.raceId,
                    editedPlayer: player,
                    onReject: () => {},
                }}
                onResolve={refetch}>
                <NewPoorActionsItem
                    name={t("pages.players.edit.name")}
                    description={t("pages.players.edit.description")}
                    iconPath={mdiHumanEdit}></NewPoorActionsItem>
            </PoorModal>
            <PoorConfirmation
                title={t("pages.players.delete.confirmation.title")}
                message={t("pages.players.delete.confirmation.text", { name: player.name, lastName: player.lastName })}
                onAccept={deletePlayer}>
                <NewPoorActionsItem
                    name={t("pages.players.delete.name")}
                    description={t("pages.players.delete.description")}
                    iconPath={mdiTrashCanOutline}></NewPoorActionsItem>
            </PoorConfirmation> */}
        </PoorActions>
    );
};

export const TimePenalties = () => {
    const raceId = useCurrentRaceId();
    const t = useTranslations();
    // const locale = useLocale();
    const { data: timePenalties, refetch } = trpc.timePenalty.allPenalties.useQuery({ raceId: raceId });

    const cols: PoorDataTableColumn<TimePenalty>[] = [
        {
            field: "bibNumber",
            headerName: t("pages.players.grid.columns.bibNumber"),
            sortable: true,
        },
        {
            field: "time",
            headerName: t("pages.players.grid.columns.classification"),
            sortable: false,
        },
        {
            field: "reason",
            headerName: t("pages.players.grid.columns.name"),
            sortable: true,
        },
        {
            headerName: t("pages.players.grid.columns.actions"),
            field: "bibNumber",
            sortable: false,
            cellRenderer: data => <PlayerActions refetch={refetch} player={data} />,
        },
    ];

    return (
        <>
            <Head>
                <title>{t("pages.players.header.title")}</title>
            </Head>

            <div className="border-1 flex h-full flex-col overflow-y-hidden border-solid border-gray-600">
                <PageHeader title={t("pages.players.header.title")} description={t("pages.players.header.description")} />
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
                        <span className="ml-2">{t("pages.players.export.button")}</span>
                    </Button>
                </div>

                {timePenalties && (
                    <div className="m-4 flex-grow overflow-hidden rounded-xl p-8 shadow-md">
                        <PoorDataTable
                            data={timePenalties}
                            columns={cols}
                            searchPlaceholder={t("pages.players.grid.search.placeholder")}
                            getRowId={item => item.bibNumber}
                            gridName="time-penalties"
                            searchFields={["reason", "time", "bibNumber"]}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
