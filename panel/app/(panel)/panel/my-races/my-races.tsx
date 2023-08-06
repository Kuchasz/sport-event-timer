"use client";

import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../../trpc-core";
import { mdiLockOpenVariantOutline, mdiLockOutline, mdiPlus, mdiRestore, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "components/modal";
import { RaceCreate } from "components/race-create";
import { RaceEdit } from "components/race-edit";
import { Confirmation } from "components/confirmation";
import { useCallback, useRef } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import classNames from "classnames";
import { PoorActions } from "components/poor-actions";

type Race = AppRouterOutputs["race"]["races"][0];
type CreatedRace = AppRouterInputs["race"]["add"];
type EditedRace = AppRouterInputs["race"]["update"];

const RegistrationEnabledRenderer = (props: { data: Race }) => <RegistrationEnabled race={props.data} />;
const RegistrationsRenderer = (props: { data: Race }) => <Registrations race={props.data} />;

const RegistrationEnabled = ({ race }: { race: Race }) => {
    return (
        <span
            className={classNames("flex h-full items-center", {
                ["text-green-600 font-semibold"]: race.registrationEnabled,
                ["text-red-600"]: !race.registrationEnabled,
            })}
        >
            {race.registrationEnabled ? <Icon size={1} path={mdiLockOpenVariantOutline} /> : <Icon size={1} path={mdiLockOutline} />}
        </span>
    );
};

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
    const updateRaceMutation = trpc.race.update.useMutation();
    const wipeRaceMutation = trpc.action.wipe.useMutation();
    const addRaceMutation = trpc.race.add.useMutation();
    const deleteRaceMutation = trpc.race.delete.useMutation();
    const setRegistrationStatusMutation = trpc.race.setRegistrationStatus.useMutation();
    const gridRef = useRef<AgGridReact<Race>>(null);

    const turnOffRegistrationAction = {
        name: "Turn off registration",
        description: "Online registration will be turned off",
        iconPath: mdiLockOutline,
        execute: async (race: Race) => {
            await setRegistrationStatusMutation.mutateAsync({ id: race.id, registrationEnabled: false });
            refetch();
        },
    };

    const turnOnRegistrationAction = {
        name: "Turn on registration",
        description: "Online registration will be turned on",
        iconPath: mdiLockOpenVariantOutline,
        execute: async (race: Race) => {
            await setRegistrationStatusMutation.mutateAsync({ id: race.id, registrationEnabled: true });
            refetch();
        },
    };

    const myRacesActions = [
        {
            name: "Wipe stopwatch",
            description: "Wipe all stopwatch data",
            iconPath: mdiRestore,
            execute: async (race: Race) => {
                const confirmed = await Demodal.open<boolean>(NiceModal, {
                    title: `Wipe race`,
                    component: Confirmation,
                    props: {
                        message: `You are trying to wipe the Race ${
                            race.name
                        } (${race.date.toLocaleDateString()}). Do you want to proceed?`,
                    },
                });

                if (confirmed) {
                    await wipeRaceMutation.mutateAsync({ raceId: race.id });
                    refetch();
                }
            },
        },
        {
            name: "Delete",
            description: "Delete race",
            iconPath: mdiTrashCan,
            execute: async (race: Race) => {
                const confirmed = await Demodal.open<boolean>(NiceModal, {
                    title: `Delete race`,
                    component: Confirmation,
                    props: {
                        message: `You are trying to delete the Race ${
                            race.name
                        } (${race.date.toLocaleDateString()}). Do you want to proceed?`,
                    },
                });

                if (confirmed) {
                    await deleteRaceMutation.mutateAsync({ raceId: race.id });
                    refetch();
                }
            },
        },
    ];

    const defaultColumns: ColDef<Race>[] = [
        {
            field: "index",
            width: 25,
            headerName: "",
            headerClass: "hidden",
            valueGetter: "node.rowIndex + 1",
            sortable: false,
            filter: false,
        },
        { field: "name", headerName: "Name", sortable: true, filter: true },
        {
            field: "date",
            headerName: "Date",
            sort: "asc",
            sortable: true,
            filter: true,
            cellRenderer: (props: { data: Race }) => <div>{props.data.date.toLocaleDateString()}</div>,
        },
        {
            field: "registrationEnabled",
            headerName: "Registration",
            sortable: true,
            cellRenderer: RegistrationEnabledRenderer,
        },
        {
            field: "registeredPlayers",
            headerName: "Registrations",
            sortable: true,
            cellRenderer: RegistrationsRenderer,
        },
        {
            field: "actions",
            width: 200,
            headerName: "Actions",
            cellStyle: { overflow: "visible" },
            cellRenderer: (props: { data: Race; context: { refetch: () => void } }) => (
                <PoorActions
                    item={props.data}
                    actions={
                        props.data.registrationEnabled
                            ? [turnOffRegistrationAction, ...myRacesActions]
                            : [turnOnRegistrationAction, ...myRacesActions]
                    }
                />
            ),
        },
    ];

    const openCreateDialog = async () => {
        const race = await Demodal.open<CreatedRace>(NiceModal, {
            title: "Create new race",
            component: RaceCreate,
            props: {},
        });

        if (race) {
            await addRaceMutation.mutateAsync(race);
            refetch();
        }
    };

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.api.sizeColumnsToFit();
    }, []);

    const openEditDialog = async (editedRace?: Race) => {
        const race = await Demodal.open<EditedRace>(NiceModal, {
            title: "Edit race",
            component: RaceEdit,
            props: {
                editedRace,
            },
        });

        if (race) {
            await updateRaceMutation.mutateAsync(race);
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>Lista wyścigów</title>
            </Head>
            <div className="ag-theme-material relative border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                </div>

                <AgGridReact<Race>
                    ref={gridRef}
                    context={{ refetch }}
                    onRowDoubleClicked={e => openEditDialog(e.data)}
                    rowClassRules={{
                        "z-10": p => {
                            return false;
                        },
                    }}
                    suppressRowVirtualisation={true}
                    suppressAnimationFrame={true}
                    suppressContextMenu={true}
                    suppressRowClickSelection={true}
                    suppressCellFocus={true}
                    suppressChangeDetection={true}
                    onRowClicked={console.log}
                    columnDefs={defaultColumns}
                    rowData={races}
                    onFirstDataRendered={onFirstDataRendered}
                    onGridSizeChanged={onFirstDataRendered}
                ></AgGridReact>
            </div>
        </>
    );
};