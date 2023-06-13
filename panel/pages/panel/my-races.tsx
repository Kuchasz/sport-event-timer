import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../connection";
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

const defaultColumns: ColDef<Race>[] = [
    { field: "index", width: 25, headerName: "", headerClass: "hidden", valueGetter: "node.rowIndex + 1", sortable: false, filter: false },
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
            <PoorActions />
            // <RaceDeleteButton refetch={props.context.refetch} race={props.data} />
        ),
    },
];

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

const RaceDeleteButton = ({ race, refetch }: { race: Race; refetch: () => void }) => {
    const deleteRaceMutation = trpc.race.delete.useMutation();
    const wipeRaceMutation = trpc.action.wipe.useMutation();
    const deleteRace = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete race`,
            component: Confirmation,
            props: {
                message: `You are trying to delete the Race ${race.name} (${race.date.toLocaleDateString()}). Do you want to proceed?`,
            },
        });

        if (confirmed) {
            await deleteRaceMutation.mutateAsync({ raceId: race.id });
            refetch();
        }
    };
    const wipeRace = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Wipe race`,
            component: Confirmation,
            props: {
                message: `You are trying to wipe the Race ${race.name} (${race.date.toLocaleDateString()}). Do you want to proceed?`,
            },
        });

        if (confirmed) {
            await wipeRaceMutation.mutateAsync({ raceId: race.id });
            refetch();
        }
    };
    return (
        <div className="flex">
            <span className="flex items-center hover:text-red-600 cursor-pointer" onClick={deleteRace}>
                <Icon size={1} path={mdiTrashCan} />
                delete
            </span>
            <span className="flex ml-4 items-center hover:text-red-600 cursor-pointer" onClick={wipeRace}>
                <Icon size={1} path={mdiRestore} />
                wipe
            </span>
        </div>
    );
};

const MyRaces = () => {
    const { data: races, refetch } = trpc.race.races.useQuery(undefined, { initialData: [] });
    const updateRaceMutation = trpc.race.update.useMutation();
    const addRaceMutation = trpc.race.add.useMutation();
    const gridRef = useRef<AgGridReact<Race>>(null);

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
                    <PoorActions />
                </div>

                <AgGridReact<Race>
                    ref={gridRef}
                    context={{ refetch }}
                    // onRowDoubleClicked={e => openEditDialog(e.data)}
                    // rowClass="absolute z-1"
                    rowClassRules={{
                        'z-10': p => {console.log(p); return false;}
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

export default MyRaces;

export { getSecuredServerSideProps as getServerSideProps } from "../../auth";
