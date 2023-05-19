import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../connection";
import { mdiPlus, mdiRestore, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "components/modal";
import { RaceCreate } from "components/race-create";
import { RaceEdit } from "components/race-edit";
import { Confirmation } from "components/confirmation";
import { useCallback, useRef } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ColDef } from "@ag-grid-community/core";

type Race = AppRouterOutputs["race"]["races"][0];
type CreatedRace = AppRouterInputs["race"]["add"];
type EditedRace = AppRouterInputs["race"]["update"];

const defaultColumns: ColDef<Race>[] = [
    { field: "id", headerName: "Id", sortable: true },
    { field: "name", headerName: "Name", sortable: true, filter: true },
    {
        field: "actions",
        width: 200,
        headerName: "Actions",
        cellRenderer: (props: { data: Race; context: { refetch: () => void } }) => (
            <RaceDeleteButton refetch={props.context.refetch} race={props.data} />
        ),
    },
];

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
            <div className="ag-theme-material border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                </div>

                <AgGridReact<Race>
                    ref={gridRef}
                    context={{ refetch }}
                    onRowDoubleClicked={e => openEditDialog(e.data)}
                    suppressCellFocus={true}
                    suppressAnimationFrame={true}
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
