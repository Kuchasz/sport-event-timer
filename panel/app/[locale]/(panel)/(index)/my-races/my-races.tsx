"use client";

import { mdiLockOpenVariantOutline, mdiLockOutline, mdiPlus, mdiRestore, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { Button } from "components/button";
import { Confirmation } from "components/confirmation";
import { NiceConfirmation, NiceModal } from "components/modal";
import { RaceCreate } from "components/panel/race/race-create";
import { RaceEdit } from "components/panel/race/race-edit";
import { PoorActions } from "components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { Demodal } from "demodal";
import { useTranslations } from "next-intl";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../../../trpc-core";

type Race = AppRouterOutputs["race"]["races"][0];
type CreatedRace = AppRouterInputs["race"]["add"];
type EditedRace = AppRouterInputs["race"]["update"];

// const RegistrationEnabledRenderer = (props: Race) => <RegistrationEnabled race={props} />;
const RegistrationsRenderer = (props: Race) => <Registrations race={props} />;

// const RegistrationEnabled = ({ race }: { race: Race }) => {
//     return (
//         <span
//             className={classNames("flex h-full items-center", {
//                 ["font-semibold text-green-600"]: race.registrationEnabled,
//                 ["text-red-600"]: !race.registrationEnabled,
//             })}
//         >
//             {race.registrationEnabled ? <Icon size={0.8} path={mdiLockOpenVariantOutline} /> : <Icon size={0.8} path={mdiLockOutline} />}
//         </span>
//     );
// };

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
    // const updateRaceMutation = trpc.race.update.useMutation();
    const wipeRaceMutation = trpc.action.wipe.useMutation();
    // const addRaceMutation = trpc.race.add.useMutation();
    const deleteRaceMutation = trpc.race.delete.useMutation();
    const setRegistrationStatusMutation = trpc.race.setRegistrationStatus.useMutation();

    const t = useTranslations();

    const turnOffRegistrationAction = {
        name: t("pages.registration.turnOffPopup.title"),
        description: t("pages.registration.turnOffPopup.description"),
        iconPath: mdiLockOutline,
        execute: async (race: Race) => {
            await setRegistrationStatusMutation.mutateAsync({ id: race.id, registrationEnabled: false });
            await refetch();
        },
    };

    const turnOnRegistrationAction = {
        name: t("pages.registration.turnOnPopup.title"),
        description: t("pages.registration.turnOnPopup.description"),
        iconPath: mdiLockOpenVariantOutline,
        execute: async (race: Race) => {
            await setRegistrationStatusMutation.mutateAsync({ id: race.id, registrationEnabled: true });
            await refetch();
        },
    };

    const myRacesActions = [
        {
            name: t("pages.races.wipeStopwatchPopup.title"),
            description: t("pages.races.wipeStopwatchPopup.description"),
            iconPath: mdiRestore,
            execute: async (race: Race) => {
                const confirmed = await Demodal.open<boolean>(NiceConfirmation, {
                    title: t("pages.races.wipeStopwatchPopup.confirmation.title"),
                    component: Confirmation,
                    props: {
                        message: t("pages.races.wipeStopwatchPopup.confirmation.text", { raceName: race.name }),
                    },
                });

                if (confirmed) {
                    await wipeRaceMutation.mutateAsync({ raceId: race.id });
                    await refetch();
                }
            },
        },
        {
            name: t("pages.races.deleteRacePopup.title"),
            description: t("pages.races.deleteRacePopup.description"),
            iconPath: mdiTrashCan,
            execute: async (race: Race) => {
                const confirmed = await Demodal.open<boolean>(NiceConfirmation, {
                    title: t("pages.races.deleteRacePopup.confirmation.title"),
                    component: Confirmation,
                    props: {
                        message: t("pages.races.deleteRacePopup.confirmation.text", { raceName: race.name }),
                    },
                });

                if (confirmed) {
                    await deleteRaceMutation.mutateAsync({ raceId: race.id });
                    void refetch();
                }
            },
        },
    ];

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
            field: "id",
            cellRenderer: data => (
                <PoorActions
                    item={data}
                    actions={
                        data.registrationEnabled
                            ? [turnOffRegistrationAction, ...myRacesActions]
                            : [turnOnRegistrationAction, ...myRacesActions]
                    }
                />
            ),
        },
    ];

    const openCreateDialog = async () => {
        const race = await Demodal.open<CreatedRace>(NiceModal, {
            title: t("pages.races.createRace.title"),
            component: RaceCreate,
            props: {},
        });

        if (race) {
            void refetch();
        }
    };

    const openEditDialog = async (editedRace?: Race) => {
        const race = await Demodal.open<EditedRace>(NiceModal, {
            title: t("pages.races.editRacePopup.title"),
            component: RaceEdit,
            props: {
                editedRace,
            },
        });

        if (race) {
            await refetch();
        }
    };

    return (
        <>
            {/* <Head>
                <title>{t("pages.races.header.title")}</title>
            </Head> */}
            <div className="border-1 relative flex h-full flex-col border-solid border-gray-600">
                {/* <PageHeader title={t("pages.races.header.title")} description={t("pages.races.header.description")} /> */}
                <div className="mb-4 inline-flex">
                    <Button outline onClick={openCreateDialog}>
                        <Icon size={0.8} path={mdiPlus} />
                        <span className="ml-2">{t("pages.races.addRace")}</span>
                    </Button>
                </div>
                <div className="m-4 flex-grow overflow-hidden rounded-xl p-8 shadow-md">
                    <PoorDataTable
                        gridName="my-races"
                        columns={defaultColumns}
                        getRowId={item => item.id.toString()}
                        data={races}
                        onRowDoubleClicked={e => openEditDialog(e)}
                    ></PoorDataTable>
                </div>
            </div>
        </>
    );
};
