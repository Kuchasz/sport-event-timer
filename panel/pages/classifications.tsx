import DataGrid, { Column, SortColumn } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "react-daisyui";
import { ClassificationCreate } from "components/classification-create";
import { ClassificationEdit } from "components/classification-edit";
import { CurrentRaceContext } from "../current-race-context";
import { Demodal } from "demodal";
import { InferMutationInput, InferQueryOutput, trpc } from "../trpc";
import { mdiAccountCogOutline, mdiAccountMultiplePlus, mdiPlus } from "@mdi/js";
import { NiceModal } from "components/modal";
import { useContext, useMemo, useState } from "react";
import { useCurrentRaceId } from "../use-current-race-id";

type Classification = InferQueryOutput<"classification.classifications">[0];
type EditedClassification = InferMutationInput<"classification.update">;
type CreatedClassification = InferMutationInput<"classification.add">;

type Comparator = (a: Classification, b: Classification) => number;
function getComparator(sortColumn: string): Comparator {
    switch (sortColumn) {
        case "name":
            return (a, b) => {
                return a[sortColumn].localeCompare(b[sortColumn]);
            };
        default:
            throw new Error(`unsupported sortColumn: "${sortColumn}"`);
    }
}

const columns: Column<Classification, unknown>[] = [
    { key: "id", name: "Id", width: 10 },
    { key: "name", name: "Name" }
];

// const sortColumns = columns.slice(1).map(x => x.key);

const Classifications = () => {
    const raceId = useCurrentRaceId();
    const { data: classifications, refetch } = trpc.useQuery(["classification.classifications", { raceId: raceId! }]);
    const updateClassificationMutation = trpc.useMutation(["classification.update"]);
    const addClassifiationMutation = trpc.useMutation(["classification.add"]);

    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    const sortedPlayers = useMemo((): readonly Classification[] => {
        if (!classifications) return [];
        if (sortColumns.length === 0) return classifications;

        return [...classifications].sort((a, b) => {
            for (const sort of sortColumns) {
                const comparator = getComparator(sort.columnKey);
                const compResult = comparator(a, b);
                if (compResult !== 0) {
                    return sort.direction === "ASC" ? compResult : -compResult;
                }
            }
            return 0;
        });
    }, [classifications, sortColumns]);

    const openCreateDialog = async () => {
        const classification = await Demodal.open<CreatedClassification>(NiceModal, {
            title: "Create new classification",
            component: ClassificationCreate,
            props: {}
        });

        if (classification) {
            await addClassifiationMutation.mutateAsync(classification);
            refetch();
        }
    };

    const openEditDialog = async (editedClassification?: Classification) => {
        const classification = await Demodal.open<EditedClassification>(NiceModal, {
            title: "Edit classification",
            component: ClassificationEdit,
            props: {
                editedClassification
            }
        });

        if (classification) {
            await updateClassificationMutation.mutateAsync(classification);
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>Lista zawodników</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 inline-flex">
                    <Button onClick={openCreateDialog} startIcon={<Icon size={1} path={mdiPlus} />}>
                        Create
                    </Button>
                    <div className="px-1"></div>
                    <Button autoCapitalize="false" startIcon={<Icon size={1} path={mdiAccountMultiplePlus} />}>
                        Load
                    </Button>
                </div>
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
                    rows={sortedPlayers}
                />
            </div>
        </>
    );
};

export default Classifications;
