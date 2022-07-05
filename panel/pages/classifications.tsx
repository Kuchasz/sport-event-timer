import DataGrid, { Column, SortColumn } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "react-daisyui";
import { Classification } from "@set/timer/model";
import { ClassificationCreate } from "components/classification-create";
import { ClassificationEdit } from "components/classification-edit";
import { getClassifications } from "../api";
import { mdiAccountCogOutline, mdiAccountMultiplePlus, mdiPlus } from "@mdi/js";
import { useEffect, useMemo, useState } from "react";

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
    const [classifications, setClassifications] = useState<Classification[]>([]);
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);

    const [createVisible, setCreateVisible] = useState<boolean>(false);
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [edited, setEdited] = useState<Classification | undefined>(undefined);

    const sortedPlayers = useMemo((): readonly Classification[] => {
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

    const toggleCreateVisible = () => {
        setCreateVisible(!createVisible);
    };

    const toggleEditVisible = (e?: Classification) => {
        setEdited(e);
        setEditVisible(!editVisible);
    };

    useEffect(() => {
        getClassifications().then(setClassifications);
    }, []);

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
                    <div className="px-1"></div>
                    <Button autoCapitalize="false" startIcon={<Icon size={1} path={mdiAccountMultiplePlus} />}>
                        Load
                    </Button>
                </div>
                <ClassificationCreate
                    isOpen={createVisible}
                    onCancel={() => toggleCreateVisible()}
                    onCreate={() => {}}
                />
                <ClassificationEdit
                    isOpen={editVisible}
                    onCancel={() => toggleEditVisible()}
                    onEdit={() => {}}
                    editedClassification={edited}
                />
                <DataGrid
                    sortColumns={sortColumns}
                    className="h-full"
                    defaultColumnOptions={{
                        sortable: true,
                        resizable: true
                    }}
                    onRowDoubleClick={e => toggleEditVisible(e)}
                    onRowsChange={setClassifications}
                    onSortColumnsChange={setSortColumns}
                    columns={columns}
                    rows={sortedPlayers}
                />
            </div>
        </>
    );
};

export default Classifications;
