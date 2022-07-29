import DataGrid, { Column, SortColumn } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Demodal } from "demodal";
import { formatTimeWithMilliSec } from "@set/shared/dist";
import { InferMutationInput, InferQueryOutput, trpc } from "../trpc";
import { mdiAccountCogOutline, mdiAccountMultiplePlus, mdiPlus } from "@mdi/js";
import { milisecondsToTimeString } from "../utils";
import { NiceModal } from "components/modal";
import { RaceCreate } from "components/race-create";
import { RaceEdit } from "components/race-edit";
import { useCurrentRaceId } from "use-current-race-id";
import { useMemo, useState } from "react";

type SplitTime = InferQueryOutput<"split-time.split-times">[0];
type CreatedRace = InferMutationInput<"race.add">;
type EditedRace = InferMutationInput<"race.update">;

const columns: Column<SplitTime, unknown>[] = [
    { key: "id", name: "Id", width: 10 },
    { key: "bibNumber", name: "Bib Number" },
    { key: "player.name", name: "Name", formatter: p => <span>{p.row.player.name}</span> },
    { key: "player.lastName", name: "Last Name", formatter: p => <span>{p.row.player.lastName}</span> },
    {
        key: "time",
        name: "Time",
        formatter: props => <div>{formatTimeWithMilliSec(props.row.measuredTime)}</div>
    }
];

const SplitTimes = () => {
    const raceId = useCurrentRaceId();
    const { data: splitTimes, refetch } = trpc.useQuery(["split-time.split-times", { raceId: raceId! }]);
    const updateRaceMutation = trpc.useMutation(["race.update"]);
    const addRaceMuttaion = trpc.useMutation(["race.add"]);
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

    const openEditDialog = async (editedRace?: SplitTime) => {
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
                {splitTimes && (
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
                        rows={splitTimes}
                    />
                )}
            </div>
        </>
    );
};

export default SplitTimes;
