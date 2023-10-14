"use client";

import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../../../../trpc-core";
import { mdiLockOpenVariantOutline, mdiLockOutline, mdiPlus, mdiRestore, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "components/modal";
import { RaceCreate } from "components/panel/race/race-create";
import { RaceEdit } from "components/panel/race/race-edit";
import { Confirmation } from "components/confirmation";
import { useCallback, useRef } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";
import classNames from "classnames";
import { PoorActions } from "components/poor-actions";
import { PageHeader } from "components/page-header";
import { useTranslations } from "next-intl";
import { refreshRow } from "ag-grid";
import { isTodayOrLater, monthForLocale } from "@set/utils/dist/datetime";
import { sort } from "@set/utils/dist/array";
import { capitalizeFirstLetter } from "@set/utils/dist/string";
import Link from "next/link";

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

export const Races = () => {
    const { data: races, refetch } = trpc.race.races.useQuery(undefined, { initialData: [] });
    const updateRaceMutation = trpc.race.update.useMutation();
    const wipeRaceMutation = trpc.action.wipe.useMutation();
    const addRaceMutation = trpc.race.add.useMutation();
    const deleteRaceMutation = trpc.race.delete.useMutation();
    const setRegistrationStatusMutation = trpc.race.setRegistrationStatus.useMutation();
    const gridRef = useRef<AgGridReact<Race>>(null);

    const t = useTranslations();

    const turnOffRegistrationAction = {
        name: t("pages.registration.turnOffPopup.title"),
        description: t("pages.registration.turnOffPopup.description"),
        iconPath: mdiLockOutline,
        execute: async (race: Race) => {
            await setRegistrationStatusMutation.mutateAsync({ id: race.id, registrationEnabled: false });
            await refetch();
            refreshRow(gridRef, race.id.toString());
        },
    };

    const turnOnRegistrationAction = {
        name: t("pages.registration.turnOnPopup.title"),
        description: t("pages.registration.turnOnPopup.description"),
        iconPath: mdiLockOpenVariantOutline,
        execute: async (race: Race) => {
            await setRegistrationStatusMutation.mutateAsync({ id: race.id, registrationEnabled: true });
            await refetch();
            refreshRow(gridRef, race.id.toString());
        },
    };

    const myRacesActions = [
        {
            name: t("pages.races.wipeStopwatchPopup.title"),
            description: t("pages.races.wipeStopwatchPopup.description"),
            iconPath: mdiRestore,
            execute: async (race: Race) => {
                const confirmed = await Demodal.open<boolean>(NiceModal, {
                    title: t("pages.races.wipeStopwatchPopup.confirmation.title"),
                    component: Confirmation,
                    props: {
                        message: t("pages.races.wipeStopwatchPopup.confirmation.text", { raceName: race.name }),
                    },
                });

                if (confirmed) {
                    await wipeRaceMutation.mutateAsync({ raceId: race.id });
                    await refetch();
                    refreshRow(gridRef, race.id.toString());
                }
            },
        },
        {
            name: t("pages.races.deleteRacePopup.title"),
            description: t("pages.races.deleteRacePopup.description"),
            iconPath: mdiTrashCan,
            execute: async (race: Race) => {
                const confirmed = await Demodal.open<boolean>(NiceModal, {
                    title: t("pages.races.deleteRacePopup.confirmation.title"),
                    component: Confirmation,
                    props: {
                        message: t("pages.races.deleteRacePopup.confirmation.text", { raceName: race.name }),
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
            width: 25,
            headerName: "",
            headerClass: "hidden",
            sortable: false,
            filter: false,
            valueGetter: r => r.node?.rowIndex,
        },
        { field: "name", headerName: t("pages.races.grid.columns.name"), sortable: true, filter: true },
        {
            field: "date",
            headerName: t("pages.races.grid.columns.date"),
            sort: "asc",
            sortable: true,
            filter: true,
            cellRenderer: (props: { data: Race }) => <div>{props.data.date.toLocaleDateString()}</div>,
        },
        {
            field: "registrationEnabled",
            headerName: t("pages.races.grid.columns.registrationEnabled"),
            sortable: true,
            cellRenderer: RegistrationEnabledRenderer,
        },
        {
            field: "registeredPlayers",
            headerName: t("pages.races.grid.columns.registeredPlayers"),
            sortable: true,
            cellRenderer: RegistrationsRenderer,
        },
        {
            width: 200,
            headerName: t("pages.races.grid.columns.actions"),
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

    const getShortcut = (name: string) => name.slice(0, 2).toUpperCase();

    const openCreateDialog = async () => {
        const race = await Demodal.open<CreatedRace>(NiceModal, {
            title: t("pages.races.createRace.title"),
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
            title: t("pages.races.editRace.title"),
            component: RaceEdit,
            props: {
                editedRace,
            },
        });

        if (race) {
            await updateRaceMutation.mutateAsync(race);
            await refetch();
            refreshRow(gridRef, editedRace!.id.toString());
        }
    };

    const sortedRaces = sort(races, r => r.date.getTime());
    const futureRaces = sortedRaces.filter(r => isTodayOrLater(r.date));
    const nextRaces = sort(futureRaces, r => r.date.getTime()).slice(0, 3);

    return (
        <>
            <Head>
                <title>{t("pages.races.header.title")}</title>
            </Head>
            <div className="relative border-1 flex flex-col h-full border-gray-600 border-solid">
                <PageHeader title={t("pages.races.header.title")} description={t("pages.races.header.description")} />
                <div className="mb-4 inline-flex">
                    <Button outline onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                        <span className="ml-2">{t("pages.races.addRace")}</span>
                    </Button>
                </div>
                <div className="flex flex-wrap gap-6">
                    {nextRaces.map(r => (
                        <Link href={`/${r.id}`} className="w-44 transition-transform ease-in-out duration-300 will-change-transform hover:-translate-y-1 overflow-hidden shadow-lg rounded-lg">
                            <div className="h-44 w-full flex flex-col gap-2 justify-center items-center bg-gray-800 text-white">
                                <div className="text-6xl">{getShortcut(r.name)}</div>
                                <div className="text-gray-400 font-semibold text-xs">{r.date.toLocaleDateString()}</div>
                            </div>
                            <div className="p-4">
                                <div className="text-sm font-semibold">{r.name}</div>
                                <div className="text-xs text-gray-500 text-ellipsis">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <PageHeader title={t("pages.races.header.title")} description={t("pages.races.header.description")} />
                <div className="flex flex-col gap-2">
                    {sortedRaces.map(r => (
                        <div className="flex items-center rounded-lg shadow-lg px-8 py-4">
                            <div className="w-10 font-semibold flex flex-col items-center">
                                <div className="text-2xl">{r.date.getDate()}</div>
                                <div className="text-sm">{capitalizeFirstLetter(monthForLocale(r.date.getMonth(), "short", "pl-PL"))}</div>
                            </div>
                            <div className="ml-8 flex flex-col">
                                <div className="font-semibold">{r.name}</div>
                                <div className="text-xs text-gray-500 text-ellipsis">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <div className="ag-theme-material h-full">
                    <AgGridReact<Race>
                        ref={gridRef}
                        context={{ refetch }}
                        onRowDoubleClicked={e => openEditDialog(e.data)}
                        rowClassRules={{
                            "z-10": () => {
                                return false;
                            },
                        }}
                        suppressRowVirtualisation={true}
                        suppressAnimationFrame={true}
                        suppressContextMenu={true}
                        suppressRowClickSelection={true}
                        suppressCellFocus={true}
                        suppressChangeDetection={true}
                        columnDefs={defaultColumns}
                        getRowId={item => item.data.id.toString()}
                        rowData={races}
                        onFirstDataRendered={onFirstDataRendered}
                        onGridSizeChanged={onFirstDataRendered}
                    ></AgGridReact>
                </div> */}
            </div>
        </>
    );
};
