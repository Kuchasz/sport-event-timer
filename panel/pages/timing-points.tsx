import DataGrid, { Column, SortColumn } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Demodal } from "demodal";
import { InferMutationInput, InferQueryOutput, trpc } from "../trpc";
import { mdiPlus } from "@mdi/js";
import { NiceModal } from "components/modal";
import { TimingPointCreate } from "components/timing-point-create";
import { TimingPointEdit } from "components/timing-point-edit";
import { useCurrentRaceId } from "use-current-race-id";
import { useState } from "react";

type TimingPoint = InferQueryOutput<"timing-point.timingPoints">[0];
type CreatedTimingPoint = InferMutationInput<"timing-point.add">;
type EditedTimingPoint = InferMutationInput<"timing-point.update">;

const columns: Column<TimingPoint, unknown>[] = [
    { key: "id", name: "Id", width: 10 },
    { key: "order", name: "Order" },
    { key: "name", name: "Name" }
];

const TimingPoint = () => {
    const raceId = useCurrentRaceId();
    const { data: races, refetch } = trpc.useQuery(["timing-point.timingPoints", { raceId: raceId! }]);
    const updateTimingPointMutation = trpc.useMutation(["timing-point.update"]);
    const addTimingPointMuttaion = trpc.useMutation(["timing-point.add"]);
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    const openCreateDialog = async () => {
        const TimingPoint = await Demodal.open<CreatedTimingPoint>(NiceModal, {
            title: "Create new timing point",
            component: TimingPointCreate,
            props: { raceId: raceId! }
        });

        if (TimingPoint) {
            await addTimingPointMuttaion.mutateAsync(TimingPoint);
            refetch();
        }
    };

    const openEditDialog = async (editedTimingPoint?: TimingPoint) => {
        const TimingPoint = await Demodal.open<EditedTimingPoint>(NiceModal, {
            title: "Edit timing point",
            component: TimingPointEdit,
            props: {
                editedTimingPoint
            }
        });

        if (TimingPoint) {
            await updateTimingPointMutation.mutateAsync(TimingPoint);
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>Timing Points list</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
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

export default TimingPoint;
