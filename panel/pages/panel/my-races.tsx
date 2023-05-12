import DataGrid, { Column } from "react-data-grid";
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

type Race = AppRouterOutputs["race"]["races"][0];
type CreatedRace = AppRouterInputs["race"]["add"];
type EditedRace = AppRouterInputs["race"]["update"];

const columns: Column<Race, unknown>[] = [
    { key: "id", name: "Id", width: 10 },
    { key: "name", name: "Name" },
    {
        key: "actions",
        width: 200,
        name: "Actions",
        formatter: props => <RaceDeleteButton race={props.row} />,
    },
];

const RaceDeleteButton = ({ race }: { race: Race }) => {
    const { refetch } = trpc.race.races.useQuery();
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
    const { data: races, refetch } = trpc.race.races.useQuery();
    const updateRaceMutation = trpc.race.update.useMutation();
    const addRaceMutation = trpc.race.add.useMutation();

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
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                </div>
                {races && (
                    <DataGrid
                        className="rdg-light h-full"
                        defaultColumnOptions={{
                            sortable: false,
                            resizable: true,
                        }}
                        onRowDoubleClick={e => openEditDialog(e)}
                        columns={columns}
                        rows={races}
                    />
                )}
            </div>
        </>
    );
};

export default MyRaces;

export { getSecuredServerSideProps as getServerSideProps } from "../../auth";
