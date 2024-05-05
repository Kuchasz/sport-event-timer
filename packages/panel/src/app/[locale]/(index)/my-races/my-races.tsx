"use client";

import { mdiCalendarEditOutline, mdiLockOpenVariantOutline, mdiLockOutline, mdiPlus, mdiRestore, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { Button } from "src/components/button";
import { PoorConfirmation, PoorModal } from "src/components/poor-modal";
import { RaceCreate } from "src/components/panel/race/race-create";
import { RaceEdit } from "src/components/panel/race/race-edit";
import { PoorActions, NewPoorActionsItem } from "src/components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { useTranslations } from "next-intl";
import type { AppRouterOutputs } from "src/trpc";
import { trpc } from "../../../../trpc-core";

type Race = AppRouterOutputs["race"]["races"][0];

const RegistrationsRenderer = (props: Race) => <Registrations race={props} />;

const Registrations = ({ race }: { race: Race }) => {
    return (
        <span className={classNames("flex h-full items-center")}>
            <span className="font-semibold">{race.registeredPlayers}</span>{" "}
            <span>
                {race.playersLimit && (
                    <span>
                        <span className="mx-1">/</span>
                        <span>{race.playersLimit}</span>
                    </span>
                )}
            </span>
        </span>
    );
};

export const MyRaces = () => {
    const { data: races, refetch } = trpc.race.races.useQuery(undefined, { initialData: [] });
    const wipeRaceMutation = trpc.action.wipe.useMutation();
    const deleteRaceMutation = trpc.race.delete.useMutation();
    const setRegistrationStatusMutation = trpc.race.setRegistrationStatus.useMutation();

    const t = useTranslations();

    const turnOffRegistrationAction = async (race: Race) => {
        await setRegistrationStatusMutation.mutateAsync({ id: race.id, registrationEnabled: false });
        void refetch();
    };

    const turnOnRegistrationAction = async (race: Race) => {
        await setRegistrationStatusMutation.mutateAsync({ id: race.id, registrationEnabled: true });
        void refetch();
    };

    const wipeRaceData = async (race: Race) => {
        await wipeRaceMutation.mutateAsync({ raceId: race.id });
        void refetch();
    };

    const deleteRace = async (race: Race) => {
        await deleteRaceMutation.mutateAsync({ raceId: race.id });
        void refetch();
    };

    const defaultColumns: PoorDataTableColumn<Race>[] = [
        {
            headerName: "",
            sortable: false,
            field: "id",
        },
        {
            headerName: t("pages.races.grid.columns.name"),
            sortable: true,
            field: "name",
        },
        {
            field: "date",
            headerName: t("pages.races.grid.columns.date"),
            sortable: false,
        },
        {
            field: "registrationEnabled",
            headerName: t("pages.races.grid.columns.registrationEnabled"),
            sortable: true,
        },
        {
            field: "registeredPlayers",
            headerName: t("pages.races.grid.columns.registeredPlayers"),
            sortable: true,
            cellRenderer: RegistrationsRenderer,
        },
        {
            headerName: t("pages.races.grid.columns.actions"),
            field: "actions",
            allowShrink: true,
            cellRenderer: data => (
                <PoorActions>
                    <PoorModal
                        onResolve={() => refetch()}
                        title={t("pages.races.editRace.title")}
                        component={RaceEdit}
                        componentProps={{
                            editedRace: data,
                            onReject: () => {},
                        }}>
                        <NewPoorActionsItem
                            name={t("pages.races.editRace.name")}
                            description={t("pages.races.editRace.description")}
                            iconPath={mdiCalendarEditOutline}></NewPoorActionsItem>
                    </PoorModal>
                    {data.registrationEnabled ? (
                        <div onClick={() => turnOffRegistrationAction(data)}>
                            <NewPoorActionsItem
                                name={t("pages.registration.turnOffPopup.title")}
                                description={t("pages.registration.turnOffPopup.description")}
                                iconPath={mdiLockOutline}></NewPoorActionsItem>
                        </div>
                    ) : (
                        <div onClick={() => turnOnRegistrationAction(data)}>
                            <NewPoorActionsItem
                                name={t("pages.registration.turnOnPopup.title")}
                                description={t("pages.registration.turnOnPopup.description")}
                                iconPath={mdiLockOpenVariantOutline}></NewPoorActionsItem>
                        </div>
                    )}
                    <PoorConfirmation
                        destructive
                        title={t("pages.races.wipeStopwatchPopup.confirmation.title")}
                        message={t("pages.races.wipeStopwatchPopup.confirmation.text", { raceName: data.name })}
                        onAccept={() => wipeRaceData(data)}
                        isLoading={wipeRaceMutation.isLoading}>
                        <NewPoorActionsItem
                            name={t("pages.races.wipeStopwatchPopup.title")}
                            description={t("pages.races.wipeStopwatchPopup.description")}
                            iconPath={mdiRestore}></NewPoorActionsItem>
                    </PoorConfirmation>
                    <PoorConfirmation
                        destructive
                        title={t("pages.races.deleteRacePopup.confirmation.title")}
                        message={t("pages.races.deleteRacePopup.confirmation.text", { raceName: data.name })}
                        onAccept={() => deleteRace(data)}
                        isLoading={deleteRaceMutation.isLoading}>
                        <NewPoorActionsItem
                            name={t("pages.races.deleteRacePopup.title")}
                            description={t("pages.races.deleteRacePopup.description")}
                            iconPath={mdiTrashCanOutline}></NewPoorActionsItem>
                    </PoorConfirmation>
                </PoorActions>
            ),
        },
    ];

    return (
        <>
            {/* <Head>
                <title>{t("pages.races.header.title")}</title>
            </Head> */}
            <div className="border-1 relative flex h-full flex-col border-solid border-gray-600">
                {/* <PageHeader title={t("pages.races.header.title")} description={t("pages.races.header.description")} /> */}
                <div className="mb-4 inline-flex">
                    <PoorModal
                        onResolve={() => refetch()}
                        title={t("pages.races.createRace.title")}
                        component={RaceCreate}
                        componentProps={{ onReject: () => {} }}>
                        <Button outline>
                            <Icon size={0.8} path={mdiPlus} />
                            <span className="ml-2">{t("pages.races.addRace")}</span>
                        </Button>
                    </PoorModal>
                </div>
                <div className="flex-grow overflow-hidden">
                    <PoorDataTable
                        gridName="my-races"
                        columns={defaultColumns}
                        getRowId={item => item.id.toString()}
                        data={races}></PoorDataTable>
                </div>
            </div>
        </>
    );
};
