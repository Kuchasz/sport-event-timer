"use client";
import { mdiAccountPlusOutline, mdiCashCheck, mdiCashRemove, mdiCheck, mdiClose, mdiExport, mdiPlus, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import type { Gender } from "@set/timer/dist/model";
import classNames from "classnames";
import { Button } from "components/button";
import { GenderIcon } from "components/gender-icon";
import { PageHeader } from "components/page-header";
import { PlayerRegistrationCreate } from "components/panel/player-registration/player-registration-create";
import { PlayerRegistrationEdit } from "components/panel/player-registration/player-registration-edit";
import { PlayerRegistrationPromotion } from "components/player-registration-promotion";
import { PoorActions } from "components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { Demodal } from "demodal";
import { useLocale, useTranslations } from "next-intl";
import Head from "next/head";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { Confirmation } from "../../../../../components/confirmation";
import { NiceConfirmation, NiceModal } from "../../../../../components/modal";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type PlayerRegistration = AppRouterOutputs["playerRegistration"]["registrations"][0];
type CreatedPlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];
type EditedPlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];
type PlayerRegistrationPromotion = AppRouterInputs["player"]["promoteRegistration"]["player"];

const PlayerRegistrationPromotedToPlayer = ({ playerRegistration }: { playerRegistration: PlayerRegistration }) => {
    return (
        <span
            className={classNames("flex h-full items-center", {
                ["font-semibold text-green-600"]: playerRegistration.promotedToPlayer,
                ["text-red-600"]: !playerRegistration.promotedToPlayer,
            })}>
            {playerRegistration.promotedToPlayer ? <Icon size={0.8} path={mdiCheck} /> : <Icon size={0.8} path={mdiClose} />}
        </span>
    );
};

const PlayerRegistrationPayment = ({
    playerRegistration,
    refetch,
}: {
    playerRegistration: PlayerRegistration;
    refetch: () => Promise<void>;
}) => {
    const setPaymentStatusMutation = trpc.playerRegistration.setPaymentStatus.useMutation();
    const t = useTranslations();
    const locale = useLocale();

    const togglePlayerPayment = async () => {
        const confirmed = await Demodal.open<boolean>(NiceConfirmation, {
            title: t("pages.playerRegistrations.togglePlayerPayment.confirmation.title"),
            component: Confirmation,
            props: {
                message: t("pages.playerRegistrations.togglePlayerPayment.confirmation.text", {
                    name: playerRegistration.name,
                    lastName: playerRegistration.lastName,
                    hasPaid: playerRegistration.hasPaid
                        ? t("pages.playerRegistrations.payment.status.notPaid")
                        : t("pages.playerRegistrations.payment.status.paid"),
                }),
            },
        });

        if (confirmed) {
            await setPaymentStatusMutation.mutateAsync({ playerId: playerRegistration.id, hasPaid: !playerRegistration.hasPaid });
            await refetch();
        }
    };
    return (
        <span
            className={classNames("flex h-full cursor-pointer items-center hover:text-black", {
                ["font-semibold text-green-600"]: playerRegistration.paymentDate !== null,
                ["text-red-600"]: playerRegistration.paymentDate === null,
            })}
            onClick={togglePlayerPayment}>
            {playerRegistration.hasPaid ? <Icon size={0.8} path={mdiCashCheck} /> : <Icon size={0.8} path={mdiCashRemove} />}
            <span className="ml-2">
                {playerRegistration.paymentDate?.toLocaleDateString(locale) ?? t("pages.playerRegistrations.payment.status.notPaid")}
            </span>
        </span>
    );
};

export const PlayerRegistrations = () => {
    const raceId = useCurrentRaceId();
    const t = useTranslations();
    const locale = useLocale();
    const { data: registrations, refetch } = trpc.playerRegistration.registrations.useQuery({ raceId: raceId }, { initialData: [] });
    const deletePlayerMutation = trpc.playerRegistration.delete.useMutation();

    const promoteToPlayerAction = {
        name: t("pages.playerRegistrations.promoteToPlayer.title"),
        description: t("pages.playerRegistrations.promoteToPlayer.description"),
        iconPath: mdiAccountPlusOutline,
        execute: async (playerRegistration: PlayerRegistration) => {
            const promotedPlayer = await Demodal.open<PlayerRegistrationPromotion>(NiceModal, {
                title: t("pages.playerRegistrations.promoteToPlayer.confirmation.title"),
                component: PlayerRegistrationPromotion,
                props: {
                    raceId: raceId,
                    playerRegistrationId: playerRegistration.id,
                },
            });

            if (promotedPlayer) {
                await refetch();
            }
        },
    };

    const deleteRegistrationAction = {
        name: t("pages.playerRegistrations.delete.title"),
        description: t("pages.playerRegistrations.delete.description"),
        iconPath: mdiTrashCan,
        execute: async (playerRegistration: PlayerRegistration) => {
            const confirmed = await Demodal.open<boolean>(NiceConfirmation, {
                title: t("pages.playerRegistrations.delete.confirmation.title"),
                component: Confirmation,
                props: {
                    message: t("pages.playerRegistrations.delete.confirmation.text", {
                        name: playerRegistration.name,
                        lastName: playerRegistration.lastName,
                    }),
                },
            });

            if (confirmed) {
                await deletePlayerMutation.mutateAsync({ playerId: playerRegistration.id });
                void refetch();
            }
        },
    };

    const cols: PoorDataTableColumn<PlayerRegistration>[] = [
        {
            field: "name",
            headerName: t("pages.playerRegistrations.grid.columns.name"),
            sortable: true,
        },
        {
            field: "lastName",
            headerName: t("pages.playerRegistrations.grid.columns.lastName"),
            sortable: true,
        },
        {
            field: "gender",
            headerName: t("pages.playerRegistrations.grid.columns.gender"),
            sortable: true,
            cellRenderer: data => <GenderIcon gender={data.gender as Gender} />,
        },
        {
            field: "birthDate",
            headerName: t("pages.playerRegistrations.grid.columns.birthDate"),
            cellRenderer: data => <div>{data.birthDate.toLocaleDateString(locale)}</div>,
            sortable: false,
            hide: true,
        },
        {
            field: "country",
            headerName: t("pages.playerRegistrations.grid.columns.country"),
            sortable: true,
            hide: true,
        },
        {
            field: "city",
            headerName: t("pages.playerRegistrations.grid.columns.city"),
            sortable: true,
            hide: true,
        },
        {
            field: "team",
            headerName: t("pages.playerRegistrations.grid.columns.team"),
            sortable: true,
            cellRenderer: data => <div className="text-ellipsis">{data.team}</div>,
        },
        { field: "phoneNumber", headerName: t("pages.playerRegistrations.grid.columns.phone"), sortable: true, hide: true },
        { field: "email", headerName: t("pages.playerRegistrations.grid.columns.email"), sortable: true, hide: true },
        {
            field: "icePhoneNumber",
            headerName: t("pages.playerRegistrations.grid.columns.icePhoneNumber"),
            sortable: true,
            hide: true,
        },
        {
            field: "registrationDate",
            headerName: t("pages.playerRegistrations.grid.columns.registrationDate"),
            sortable: false,
            cellRenderer: data => <div>{data.registrationDate.toLocaleDateString(locale)}</div>,
        },
        {
            field: "paymentDate",
            headerName: t("pages.playerRegistrations.grid.columns.payment"),
            sortable: false,
            cellRenderer: data => (
                <PlayerRegistrationPayment
                    refetch={async () => {
                        await refetch();
                    }}
                    playerRegistration={data}
                />
            ),
        },
        {
            field: "promotedToPlayer",
            headerName: t("pages.playerRegistrations.grid.columns.promotedToPlayer"),
            sortable: true,
            cellRenderer: data => <PlayerRegistrationPromotedToPlayer playerRegistration={data} />,
        },
        {
            field: "id",
            sortable: false,
            headerName: t("pages.playerRegistrations.grid.columns.actions"),
            cellRenderer: data => (
                <PoorActions
                    item={data}
                    actions={data.promotedToPlayer ? [deleteRegistrationAction] : [promoteToPlayerAction, deleteRegistrationAction]}
                />
            ),
        },
    ];

    const openCreateDialog = async () => {
        const player = await Demodal.open<CreatedPlayerRegistration>(NiceModal, {
            title: t("pages.playerRegistrations.create.title"),
            component: PlayerRegistrationCreate,
            props: {
                raceId: raceId,
            },
        });

        if (player) {
            void refetch();
        }
    };

    const openEditDialog = async (editedPlayerRegistration?: PlayerRegistration) => {
        const playerRegistration = await Demodal.open<EditedPlayerRegistration>(NiceModal, {
            title: t("pages.playerRegistrations.edit.title"),
            component: PlayerRegistrationEdit,
            props: {
                raceId: raceId,
                editedPlayerRegistration,
            },
        });

        if (playerRegistration) {
            await refetch();
            // refreshRegistrationRow(playerRegistration.id!.toString());
        }
    };

    return (
        <>
            <Head>
                <title>t('pages.playerRegistrations.header.title')</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader
                    title={t("pages.playerRegistrations.header.title")}
                    description={t("pages.playerRegistrations.header.description")}
                />
                <div className="mb-4 flex">
                    <Button outline onClick={openCreateDialog}>
                        <Icon size={0.8} path={mdiPlus} />
                        <span className="ml-2">{t("pages.playerRegistrations.create.button")}</span>
                    </Button>
                    <Button
                        outline
                        className="ml-2"
                        onClick={() => {
                            alert("export does not work for now!");
                            // gridRef.current?.api.exportDataAsCsv({
                            //     fileName: `player-registrations-${new Date().toLocaleDateString(locale)}.csv`,
                            // });
                        }}>
                        <Icon size={0.8} path={mdiExport} />
                        <span className="ml-2">{t("pages.playerRegistrations.export.button")}</span>
                    </Button>
                </div>
                <div className="m-4 flex-grow overflow-hidden rounded-xl p-8 shadow-md">
                    <PoorDataTable
                        data={registrations}
                        columns={cols}
                        searchPlaceholder={t("pages.playerRegistrations.grid.search.placeholder")}
                        getRowId={data => data.id}
                        onRowDoubleClicked={openEditDialog}
                        gridName="player-registrations"
                        searchFields={["name", "lastName", "team", "country", "city"]}
                    />
                </div>
            </div>
        </>
    );
};
