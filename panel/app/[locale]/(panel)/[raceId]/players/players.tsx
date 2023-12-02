"use client";
import { mdiExport, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import type { Gender } from "@set/timer/dist/model";
import { milisecondsToTimeString } from "@set/utils/dist/datetime";
import { Button } from "components/button";
import { GenderIcon } from "components/gender-icon";
import { PageHeader } from "components/page-header";
import { PlayerEdit } from "components/panel/player/player-edit";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { Demodal } from "demodal";
import { useLocale, useTranslations } from "next-intl";
import Head from "next/head";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { ConfirmationModal, NiceModal } from "../../../../../components/modal";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type Player = AppRouterOutputs["player"]["players"][0];
type EditedPlayer = AppRouterInputs["player"]["edit"]["player"];

const PlayerDeleteButton = ({ player, refetch }: { player: Player; refetch: () => void }) => {
    const deletePlayerMutation = trpc.player.delete.useMutation();
    const t = useTranslations();
    const deletePlayer = async () => {
        await deletePlayerMutation.mutateAsync({ playerId: player.id });
        refetch();
    };

    return (
        <ConfirmationModal
            title={t("pages.players.delete.confirmation.title")}
            message={t("pages.players.delete.confirmation.text", { name: player.name, lastName: player.lastName })}
            onAccept={deletePlayer}>
            <span className="flex cursor-pointer items-center hover:text-red-600">
                <Icon size={0.8} path={mdiTrashCan} />
                {t("pages.players.delete.button")}
            </span>
        </ConfirmationModal>
    );
};

export const Players = () => {
    const raceId = useCurrentRaceId();
    const t = useTranslations();
    const locale = useLocale();
    const { data: players, refetch } = trpc.player.players.useQuery({ raceId: raceId });

    const cols: PoorDataTableColumn<Player>[] = [
        {
            field: "bibNumber",
            headerName: t("pages.players.grid.columns.bibNumber"),
            sortable: true,
        },
        {
            field: "classificationId",
            headerName: t("pages.players.grid.columns.classification"),
            sortable: false,
            cellRenderer: data => data.classification.name,
        },
        {
            field: "name",
            headerName: t("pages.players.grid.columns.name"),
            sortable: true,
        },
        {
            field: "lastName",
            headerName: t("pages.players.grid.columns.lastName"),
            sortable: true,
        },
        {
            field: "gender",
            headerName: t("pages.players.grid.columns.gender"),
            sortable: true,
            cellRenderer: data => <GenderIcon gender={data.gender as Gender} />,
        },
        {
            field: "startTime",
            headerName: t("pages.players.grid.columns.startTime"),
            sortable: true,
            cellRenderer: data => <div>{milisecondsToTimeString(data.startTime)}</div>,
        },
        {
            field: "birthDate",
            headerName: t("pages.players.grid.columns.birthDate"),
            sortable: false,
            hide: true,
            cellRenderer: data => <div>{data.birthDate.toLocaleDateString(locale)}</div>,
        },
        {
            field: "country",
            headerName: t("pages.players.grid.columns.country"),
            sortable: true,
            hide: true,
        },
        {
            field: "city",
            headerName: t("pages.players.grid.columns.city"),
            sortable: true,
            hide: true,
        },
        {
            field: "team",
            headerName: t("pages.players.grid.columns.team"),
            sortable: true,
            hide: true,
        },
        {
            field: "email",
            headerName: t("pages.players.grid.columns.email"),
            sortable: true,
            hide: true,
        },
        {
            field: "phoneNumber",
            headerName: t("pages.players.grid.columns.phoneNumber"),
            sortable: true,
            hide: true,
        },
        {
            field: "icePhoneNumber",
            headerName: t("pages.players.grid.columns.icePhoneNumber"),
            sortable: true,
            hide: true,
        },
        {
            headerName: t("pages.players.grid.columns.actions"),
            field: "bibNumber",
            sortable: false,
            cellRenderer: data => <PlayerDeleteButton refetch={refetch} player={data} />,
        },
    ];

    const openEditDialog = async (editedPlayer?: Player) => {
        const player = await Demodal.open<EditedPlayer>(NiceModal, {
            title: t("pages.players.edit.title"),
            component: PlayerEdit,
            props: {
                raceId: raceId,
                editedPlayer,
            },
        });

        if (player) {
            await refetch();
        }
    };

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

                {players && (
                    <div className="m-4 flex-grow overflow-hidden rounded-xl p-8 shadow-md">
                        <PoorDataTable
                            data={players}
                            columns={cols}
                            searchPlaceholder={t("pages.players.grid.search.placeholder")}
                            getRowId={item => item.bibNumber}
                            onRowDoubleClicked={openEditDialog}
                            gridName="players"
                            searchFields={["name", "lastName", "team", "bibNumber", "city"]}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
