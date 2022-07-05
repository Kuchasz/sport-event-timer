import DataGrid, {
    Column,
    EditorProps,
    SortColumn,
    TextEditor
    } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import {
    Button,
    Input,
    InputGroup,
    Modal,
    Select
    } from "react-daisyui";
import { exportToCsv, exportToPdf, exportToXlsx } from "exportUtils";
import { Gender, RegistrationPlayer } from "@set/timer/model";
import { getAllPlayers } from "../api";
import {
    mdiAccountMultiplePlus,
    mdiContentSaveCheck,
    mdiNumeric,
    mdiPlus
    } from "@mdi/js";
import { PlayerCreate } from "../components/player-create";
import { PlayerEdit } from "components/player-edit";
import { useEffect, useMemo, useState } from "react";

type Comparator = (a: RegistrationPlayer, b: RegistrationPlayer) => number;
function getComparator(sortColumn: string): Comparator {
    switch (sortColumn) {
        case "classificationId":
        case "name":
        case "lastName":
        case "gender":

        case "country":
        case "city":
        case "team":
        case "email":
        case "phoneNumber":
        case "icePhoneNumber":
            return (a, b) => {
                return a[sortColumn].localeCompare(b[sortColumn]);
            };
        // case "available":
        //     return (a, b) => {
        //         return a[sortColumn] === b[sortColumn] ? 0 : a[sortColumn] ? 1 : -1;
        //     };
        // case "id":
        // case "progress":
        case "birthDate":
            // case "startTimestamp":
            // case "endTimestamp":
            // case "budget":
            return (a, b) => {
                return a[sortColumn].getDate() - b[sortColumn].getDate();
            };
        default:
            throw new Error(`unsupported sortColumn: "${sortColumn}"`);
    }
}

const columns: Column<RegistrationPlayer, unknown>[] = [
    { key: "id", name: "Id", width: 10, sortable: false, resizable: false },
    {
        key: "classificationId",
        name: "Classification Id"
    },
    { key: "name", name: "Name" },
    { key: "lastName", name: "Last Name" },
    {
        key: "gender",
        name: "Gender",
        width: 10
    },
    { key: "birthDate", name: "Birth Date" },
    { key: "country", name: "Country", width: 10 },
    { key: "city", name: "City" },
    { key: "team", name: "Team" },
    { key: "email", name: "Email" },
    { key: "phoneNumber", name: "Phone Number" },
    { key: "icePhoneNumber", name: "Ice Phone Number" }
];

// const sortColumns = columns.slice(1).map(x => x.key);

const ExportButton = ({ onExport, children }: { onExport: () => Promise<unknown>; children: React.ReactChild }) => {
    const [exporting, setExporting] = useState(false);
    return (
        <Button
            disabled={exporting}
            loading={exporting}
            onClick={async () => {
                setExporting(true);
                await onExport();
                setExporting(false);
            }}
        >
            {exporting ? "Exporting" : children}
        </Button>
    );
};

const StartingList = () => {
    const [players, setPlayers] = useState<RegistrationPlayer[]>([]);
    const [createVisible, setCreateVisible] = useState<boolean>(false);
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
    const [edited, setEdited] = useState<RegistrationPlayer | undefined>(undefined);

    const sortedPlayers = useMemo((): readonly RegistrationPlayer[] => {
        if (sortColumns.length === 0) return players;

        return [...players].sort((a, b) => {
            for (const sort of sortColumns) {
                const comparator = getComparator(sort.columnKey);
                const compResult = comparator(a, b);
                if (compResult !== 0) {
                    return sort.direction === "ASC" ? compResult : -compResult;
                }
            }
            return 0;
        });
    }, [players, sortColumns]);

    useEffect(() => {
        getAllPlayers().then(setPlayers);
    }, []);

    const toggleCreateVisible = () => {
        setCreateVisible(!createVisible);
    };

    const toggleEditVisible = (e?: RegistrationPlayer) => {
        setEdited(e);
        setEditVisible(!editVisible);
    };

    const gridElement = (
        <DataGrid
            sortColumns={sortColumns}
            className="h-full"
            defaultColumnOptions={{
                sortable: true,
                resizable: true
            }}
            onRowDoubleClick={e => toggleEditVisible(e)}
            onRowsChange={setPlayers}
            onSortColumnsChange={setSortColumns}
            columns={columns}
            rows={sortedPlayers}
        />
    );

    return (
        <>
            <Head>
                <title>Lista zawodników</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="mb-4 flex">
                    <Button onClick={toggleCreateVisible} startIcon={<Icon size={1} path={mdiPlus} />}>
                        Create
                    </Button>
                    <div className="px-1"></div>
                    <Button autoCapitalize="false" startIcon={<Icon size={1} path={mdiAccountMultiplePlus} />}>
                        Load
                    </Button>
                    <div className="px-1"></div>
                    <Button autoCapitalize="false" startIcon={<Icon size={1} path={mdiNumeric} />}>
                        Set numbers
                    </Button>
                    <div className="grow"></div>
                    <ExportButton onExport={() => exportToCsv(gridElement, "Players.csv")}>Export to CSV</ExportButton>
                    <div className="px-1"></div>
                    <ExportButton onExport={() => exportToXlsx(gridElement, "Players.xlsx")}>
                        Export to XSLX
                    </ExportButton>
                    <div className="px-1"></div>
                    <ExportButton onExport={() => exportToPdf(gridElement, "Players.pdf")}>Export to PDF</ExportButton>
                </div>
                <PlayerCreate isOpen={createVisible} onCancel={() => toggleCreateVisible()} onCreate={() => {}} />
                <PlayerEdit
                    isOpen={editVisible}
                    onCancel={() => toggleEditVisible()}
                    onEdit={() => {}}
                    editedPlayer={edited}
                />
                {gridElement}
            </div>
        </>
    );
};

export default StartingList;
