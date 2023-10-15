"use client";

import Icon from "@mdi/react";
import { Button } from "components/button";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../../../../trpc-core";
import { mdiCog, mdiLockOpenVariantOutline, mdiLockOutline, mdiPlus, mdiRestore, mdiTrashCan } from "@mdi/js";
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
import { dayForLocale, isPast, isTodayOrLater, monthForLocale, timeOnlyFormatTimeNoSec } from "@set/utils/dist/datetime";
import { sort, sortDesc } from "@set/utils/dist/array";
import { capitalizeFirstLetter } from "@set/utils/dist/string";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
            {race.registrationEnabled ? <Icon size={0.6} path={mdiLockOpenVariantOutline} /> : <Icon size={0.6} path={mdiLockOutline} />}
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

const MiniChooserItem = ({ isActive, name }: { isActive: boolean; name: string }) => (
    <div className={classNames("mx-0.5 rounded-lg px-4", { ["bg-white"]: isActive, ["cursor-pointer hover:bg-gray-50"]: !isActive })}>
        {name}
    </div>
);

const MiniChooser = () => (
    <div className="flex text-sm rounded-lg px-0.5 py-1 bg-gray-100 items-center">
        <MiniChooserItem isActive={false} name="All" />
        <MiniChooserItem isActive={true} name="Upcoming" />
        <MiniChooserItem isActive={false} name="Past" />
    </div>
);

export const Races = () => {
    const { data: races, refetch } = trpc.race.races.useQuery(undefined, { initialData: [] });
    const updateRaceMutation = trpc.race.update.useMutation();
    const wipeRaceMutation = trpc.action.wipe.useMutation();
    const addRaceMutation = trpc.race.add.useMutation();
    const deleteRaceMutation = trpc.race.delete.useMutation();
    const setRegistrationStatusMutation = trpc.race.setRegistrationStatus.useMutation();
    const gridRef = useRef<AgGridReact<Race>>(null);
    const router = useRouter();

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

    const manageRace = (raceId: number) => {
        router.push(`/${raceId}`);
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

    // const sortedRaces = sort(races, r => r.date.getTime());

    const futureRaces = races.filter(r => isTodayOrLater(r.date));
    const ascSortedFutureRaces = sort(futureRaces, f => f.date.getTime());

    const pastRaces = races.filter(r => isPast(r.date));
    const descSortedPastRaces = sortDesc(pastRaces, r => r.date.getTime());

    // const nextRaces = sort(futureRaces, r => r.date.getTime()).slice(0, 3);

    const upcomingRaces = ascSortedFutureRaces.slice(0, 3);
    const allRaces = [...ascSortedFutureRaces, ...descSortedPastRaces];

    return (
        <>
            {/* <Head>
                <title>{t("pages.races.header.title")}</title>
            </Head> */}
            <div className="relative border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="py-8 flex flex-col items-center">
                    <div className="w-[768px]">
                        <PageHeader
                            title={t("pages.races.upcomingRaces.header.title")}
                            description={t("pages.races.upcomingRaces.header.description")}
                        />
                        <div className="mb-4 inline-flex">
                            <Button outline onClick={openCreateDialog}>
                                <Icon size={0.8} path={mdiPlus} />
                                <span className="ml-2">{t("pages.races.addRace")}</span>
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-6">
                            {upcomingRaces.map(r => (
                                <Link
                                    key={r.id}
                                    href={`/${r.id}`}
                                    className="w-44 transition-transform ease-in-out duration-300 will-change-transform hover:-translate-y-1 overflow-hidden shadow-lg rounded-lg"
                                >
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
                    </div>
                </div>
                <div className="bg-gray-50 py-8 flex flex-col items-center">
                    <div className="w-[768px]">
                        <div className="flex items-center justify-between">
                            <PageHeader
                                title={t("pages.races.list.header.title", { number: allRaces.length })}
                                description={t("pages.races.list.header.description")}
                            />
                            <MiniChooser />
                        </div>
                        <div className="flex flex-col gap-2">
                            {allRaces.map(r => (
                                <div key={r.id} className="flex bg-white items-center rounded-md shadow-lg px-8 py-6">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full font-semibold flex flex-col justify-center items-center">
                                        <div className="text-2xs font-semibold text-gray-400">
                                            {monthForLocale(r.date.getMonth(), "short", "pl-PL").toUpperCase()}
                                        </div>
                                        <div className="text-2xl">{r.date.getDate().toString().padStart(2, "0")}</div>
                                    </div>
                                    <div className="ml-8 flex flex-col">
                                        <div className="text-xs text-gray-400">
                                            <span>{capitalizeFirstLetter(dayForLocale(r.date, "long", "pl-PL"))}, </span>
                                            <span>{r.date.getDate().toString().padStart(2, "0")} </span>
                                            <span>{capitalizeFirstLetter(monthForLocale(r.date.getMonth(), "long", "pl-PL"))} </span>
                                            <span>{r.date.getFullYear().toString()} </span>
                                            <span className="mx-1">•</span>
                                            <span>{timeOnlyFormatTimeNoSec(r.date.getTime())}</span>
                                        </div>
                                        <div className="flex text-xs">
                                            <div className="flex items-center">
                                                <div className="mr-1">{t("pages.races.registrationStatus")}</div>
                                                <RegistrationEnabled race={r} />
                                            </div>
                                            <div className="flex items-center">
                                                <div className="ml-2 mr-1">{t("pages.races.registrations")}</div>
                                                <Registrations race={r} />
                                            </div>
                                        </div>
                                        {/* <div className="text-xs font-semibold text-gray-500 text-ellipsis">Cycling</div> */}
                                        <div className="font-semibold py-2">{r.name}</div>
                                        <div className="text-xs text-gray-500 text-ellipsis">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                        </div>
                                    </div>
                                    <div className="grow"></div>
                                    <Link href={`/${r.id}`} className="">
                                        <Button outline>
                                            <Icon size={0.8} path={mdiCog} />
                                            <span className="ml-2">{t("pages.races.manage")}</span>
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
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
