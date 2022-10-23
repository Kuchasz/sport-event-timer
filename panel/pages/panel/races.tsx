import DataGrid, { Column, SortColumn } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Demodal } from "demodal";
import { AppRouterTypes } from "trpc";
import { trpc } from "../../connection";
import { mdiPlus, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "components/modal";
import { RaceCreate } from "components/race-create";
import { RaceEdit } from "components/race-edit";
import { useState } from "react";
import { Confirmation } from "components/confirmation";

type Race = AppRouterTypes["race"]["races"]["output"][0];
type CreatedRace = AppRouterTypes["race"]["add"]["input"];
type EditedRace = AppRouterTypes["race"]["update"]["input"];

const columns: Column<Race, unknown>[] = [
    { key: "id", name: "Id", width: 10 },
    { key: "name", name: "Name" },
    {
        key: "actions",
        width: 15,
        name: "Actions",
        formatter: props => <RaceDeleteButton race={props.row} />
    }
];

const RaceDeleteButton = ({ race }: { race: Race }) => {
    const { refetch } = trpc.race.races.useQuery();
    const deleteRaceMutation = trpc.race.delete.useMutation();
    const deletePlayer = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete player`,
            component: Confirmation,
            props: {
                message: `You are trying to delete the Race ${race.name} (${race.date}). Do you want to proceed?`
            }
        });

        if (confirmed) {
            await deleteRaceMutation.mutateAsync({ raceId: race.id });
            refetch();
        }
    };
    return (
        <span className="flex items-center hover:text-red-600 cursor-pointer" onClick={deletePlayer}>
            <Icon size={1} path={mdiTrashCan} />
            delete
        </span>
    );
};

const Races = () => {
    const { data: races, refetch } = trpc.race.races.useQuery();
    const updateRaceMutation = trpc.race.update.useMutation();
    const addRaceMuttaion = trpc.race.add.useMutation();
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    const openCreateDialog = async () => {
        const race = await Demodal.open<CreatedRace>(NiceModal, {
            title: "Create new race",
            component: RaceCreate,
            props: {}
        });

        if (race) {
            await addRaceMuttaion.mutateAsync(race);
            refetch();
        }
    };

    const openEditDialog = async (editedRace?: Race) => {
        const race = await Demodal.open<EditedRace>(NiceModal, {
            title: "Edit race",
            component: RaceEdit,
            props: {
                editedRace
            }
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
                    <DataGrid className='rdg-light h-full'
                        sortColumns={sortColumns}
                        defaultColumnOptions={{
                            sortable: true,
                            resizable: true
                        }}
                        onRowDoubleClick={e => openEditDialog(e)}
                        onSortColumnsChange={setSortColumns}
                        columns={columns}
                        rows={races}
                    />
                )}
            </div>
        </>
    );
};

export default Races;
