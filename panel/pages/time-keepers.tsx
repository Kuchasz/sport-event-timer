import DataGrid, { Column, SortColumn } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "react-daisyui";
import { Demodal } from "demodal";
import { InferMutationInput, InferQueryOutput, trpc } from "../trpc";
import { mdiPlus } from "@mdi/js";
import { NiceModal } from "components/modal";
import { RaceCreate } from "components/race-create";
import { RaceEdit } from "components/race-edit";
import { useCurrentRaceId } from "use-current-race-id";
import { useState } from "react";

type TimeKeeper = InferQueryOutput<"timekeeper.timeKeepers">[0];
type CreatedTimeKeeper = InferMutationInput<"timekeeper.add">;
type EditedTimeKeeper = InferMutationInput<"timekeeper.update">;

const columns: Column<TimeKeeper, unknown>[] = [
    { key: "id", name: "Id", width: 10 },
    { key: "order", name: "Order" },
    { key: "name", name: "Name" }
];

const TimeKeeper = () => {
    const raceId = useCurrentRaceId();
    const { data: races, refetch } = trpc.useQuery(["timekeeper.timeKeepers", { raceId: raceId! }]);
    const updateTimeKeeperMutation = trpc.useMutation(["timekeeper.update"]);
    const addTimeKeeperMuttaion = trpc.useMutation(["timekeeper.add"]);
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    const toggleCreateVisible = async () => {
        const timeKeeper = await Demodal.open<CreatedTimeKeeper>(NiceModal, {
            title: "Create new time keeper",
            component: RaceCreate,
            props: {}
        });

        if (timeKeeper) {
            await addTimeKeeperMuttaion.mutateAsync(timeKeeper);
            refetch();
        }
    };

    const toggleEditVisible = async (editedRace?: TimeKeeper) => {
        const timeKeeper = await Demodal.open<EditedTimeKeeper>(NiceModal, {
            title: "Edit time keeper",
            component: RaceEdit,
            props: {
                editedRace
            }
        });

        if (timeKeeper) {
            await updateTimeKeeperMutation.mutateAsync(timeKeeper);
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>Time Keepers list</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={toggleCreateVisible} startIcon={<Icon size={1} path={mdiPlus} />}>
                        Create
                    </Button>
                </div>
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

export default TimeKeeper;
