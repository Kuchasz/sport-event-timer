import DataGrid, { Column, SortColumn } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "react-daisyui";
import { InferQueryOutput, trpc } from "../trpc";
import { mdiAccountCogOutline, mdiAccountMultiplePlus, mdiPlus } from "@mdi/js";
import { RaceCreate } from "components/race-create";
import { RaceEdit } from "components/race-edit";
import { useMemo, useState } from "react";

type Race = InferQueryOutput<"race.races">[0];

const columns: Column<Race, unknown>[] = [
    { key: "id", name: "Id", width: 10 },
    { key: "name", name: "Name" }
];

const Races = () => {
    const { data: races } = trpc.useQuery(["race.races"]);
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    const [createVisible, setCreateVisible] = useState<boolean>(false);
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [edited, setEdited] = useState<Race | undefined>(undefined);

    const toggleCreateVisible = () => {
        setCreateVisible(!createVisible);
    };

    const toggleEditVisible = (e?: Race) => {
        setEdited(e);
        setEditVisible(!editVisible);
    };

    return (
        <>
            <Head>
                <title>Lista zawodników</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={toggleCreateVisible} startIcon={<Icon size={1} path={mdiPlus} />}>
                        Create
                    </Button>
                </div>
                <RaceCreate isOpen={createVisible} onCancel={() => toggleCreateVisible()} onCreate={() => {}} />
                <RaceEdit
                    isOpen={editVisible}
                    onCancel={() => toggleEditVisible()}
                    onEdit={() => {}}
                    editedRace={edited}
                />
                {races && (
                    <DataGrid
                        sortColumns={sortColumns}
                        className="h-full"
                        defaultColumnOptions={{
                            sortable: true,
                            resizable: true
                        }}
                        onRowDoubleClick={e => toggleEditVisible(e)}
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
