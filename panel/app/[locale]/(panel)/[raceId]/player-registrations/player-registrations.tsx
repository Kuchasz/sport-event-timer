"use client";
import {
    mdiAccountPlusOutline,
    mdiCashCheck,
    mdiCashRemove,
    mdiCheck,
    mdiClose,
    mdiExport,
    mdiHumanEdit,
    mdiPlus,
    mdiTrashCanOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import type { Gender } from "@set/timer/dist/model";
import classNames from "classnames";
import { Button } from "components/button";
import { GenderIcon } from "components/gender-icon";
import { PageHeader } from "components/page-header";
import { PlayerRegistrationCreate } from "components/panel/player-registration/player-registration-create";
import { PlayerRegistrationEdit } from "components/panel/player-registration/player-registration-edit";
import { PlayerRegistrationPromotion } from "components/player-registration-promotion";
import { NewPoorActions, NewPoorActionsItem } from "components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { useLocale, useTranslations } from "next-intl";
import Head from "next/head";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { PoorConfirmation, PoorModal } from "../../../../../components/poor-modal";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";
import { useToast } from "components/use-toast";

type PlayerRegistration = AppRouterOutputs["playerRegistration"]["registrations"][0];
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

const PlayerRegistrationActions = ({ playerRegistration, refetch }: { playerRegistration: PlayerRegistration; refetch: () => void }) => {
    const deletePlayerMutation = trpc.playerRegistration.delete.useMutation();
    const t = useTranslations();

    const deletePlayerRegistration = async () => {
        await deletePlayerMutation.mutateAsync({ id: playerRegistration.id, raceId: playerRegistration.raceId });
        void refetch();
    };

    const playerPromoted = () => {
        void refetch();
    };

    return (
        <NewPoorActions>
            <PoorModal
                title={t("pages.playerRegistrations.edit.title")}
                component={PlayerRegistrationEdit}
                onResolve={refetch}
                componentProps={{
                    raceId: playerRegistration.raceId,
                    editedPlayerRegistration: playerRegistration,
                    onReject: () => null,
                }}>
                <NewPoorActionsItem
                    name={t("pages.playerRegistrations.edit.name")}
                    description={t("pages.playerRegistrations.edit.description")}
                    iconPath={mdiAccountPlusOutline}></NewPoorActionsItem>
            </PoorModal>
            <PoorConfirmation
                message={t("pages.playerRegistrations.delete.confirmation.text", {
                    name: playerRegistration.name,
                    lastName: playerRegistration.lastName,
                })}
                title={t("pages.playerRegistrations.delete.confirmation.title")}
                onAccept={() => deletePlayerRegistration()}>
                <NewPoorActionsItem
                    name={t("pages.playerRegistrations.delete.title")}
                    description={t("pages.playerRegistrations.delete.description")}
                    iconPath={mdiTrashCanOutline}></NewPoorActionsItem>
            </PoorConfirmation>
            {!playerRegistration.promotedToPlayer && (
                <PoorModal
                    title={t("pages.playerRegistrations.promoteToPlayer.confirmation.title")}
                    component={PlayerRegistrationPromotion}
                    onResolve={playerPromoted}
                    componentProps={{
                        raceId: playerRegistration.raceId,
                        playerRegistrationId: playerRegistration.id,
                        onReject: () => null,
                    }}>
                    <NewPoorActionsItem
                        name={t("pages.playerRegistrations.promoteToPlayer.title")}
                        description={t("pages.playerRegistrations.promoteToPlayer.description")}
                        iconPath={mdiHumanEdit}></NewPoorActionsItem>
                </PoorModal>
            )}
        </NewPoorActions>
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
        await setPaymentStatusMutation.mutateAsync({ playerId: playerRegistration.id, hasPaid: !playerRegistration.hasPaid });
        await refetch();
    };
    return (
        <PoorConfirmation
            title={t("pages.playerRegistrations.togglePlayerPayment.confirmation.title")}
            message={t("pages.playerRegistrations.togglePlayerPayment.confirmation.text", {
                name: playerRegistration.name,
                lastName: playerRegistration.lastName,
                hasPaid: playerRegistration.hasPaid
                    ? t("pages.playerRegistrations.payment.status.notPaid")
                    : t("pages.playerRegistrations.payment.status.paid"),
            })}
            onAccept={togglePlayerPayment}>
            <span
                className={classNames("flex h-full cursor-pointer items-center hover:text-black", {
                    ["font-semibold text-green-600"]: playerRegistration.paymentDate !== null,
                    ["text-red-600"]: playerRegistration.paymentDate === null,
                })}>
                {playerRegistration.hasPaid ? <Icon size={0.8} path={mdiCashCheck} /> : <Icon size={0.8} path={mdiCashRemove} />}
                <span className="ml-2">
                    {playerRegistration.paymentDate?.toLocaleDateString(locale) ?? t("pages.playerRegistrations.payment.status.notPaid")}
                </span>
            </span>
        </PoorConfirmation>
    );
};

export const PlayerRegistrations = () => {
    const raceId = useCurrentRaceId();
    const t = useTranslations();
    const locale = useLocale();
    const { data: registrations, refetch } = trpc.playerRegistration.registrations.useQuery({ raceId: raceId }, { initialData: [] });

    const { toast } = useToast();

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
            cellRenderer: data => <PlayerRegistrationActions refetch={refetch} playerRegistration={data} />,
        },
    ];

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
                    <PoorModal
                        title={t("pages.playerRegistrations.create.title")}
                        component={PlayerRegistrationCreate}
                        onResolve={() => refetch()}
                        componentProps={{
                            raceId: raceId,
                            onReject: () => {},
                        }}>
                        <Button outline>
                            <Icon size={0.8} path={mdiPlus} />
                            <span className="ml-2">{t("pages.playerRegistrations.create.button")}</span>
                        </Button>
                    </PoorModal>
                    <Button
                        outline
                        className="ml-2"
                        onClick={() => {
                            // alert("export does not work for now!");
                            toast({
                                title: "pages.playerRegistrations.export.title",
                                description: "pages.playerRegistrations.export.description",
                            });
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
                        gridName="player-registrations"
                        searchFields={["name", "lastName", "team", "country", "city"]}
                    />
                </div>
            </div>
        </>
    );
};
