import DataGrid, { Column, SortColumn } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "react-daisyui";
import { CurrentRaceContext } from "../current-race-context";
import { exportToCsv, exportToPdf, exportToXlsx } from "exportUtils";
import { InferQueryOutput, trpc } from "../trpc";
import { mdiAccountMultiplePlus, mdiNumeric, mdiPlus } from "@mdi/js";
import { PlayerCreate } from "../components/player-create";
import { PlayerEdit } from "components/player-edit";
import { useContext, useState } from "react";

type Player = InferQueryOutput<"player.players">[0];

const columns: Column<Player, unknown>[] = [
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
    const { raceId } = useContext(CurrentRaceContext);
    const { data: players } = trpc.useQuery(["player.players", { raceId: raceId! }]);
    const [createVisible, setCreateVisible] = useState<boolean>(false);
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const [edited, setEdited] = useState<Player | undefined>(undefined);

    const toggleCreateVisible = () => {
        setCreateVisible(!createVisible);
    };

    const toggleEditVisible = (e?: Player) => {
        setEdited(e);
        setEditVisible(!editVisible);
    };

    // const gridElement = (
    //     <DataGrid
    //         sortColumns={sortColumns}
    //         className="h-full"
    //         defaultColumnOptions={{
    //             sortable: true,
    //             resizable: true
    //         }}
    //         onRowDoubleClick={e => toggleEditVisible(e)}
    //         onSortColumnsChange={setSortColumns}
    //         columns={columns}
    //         rows={players}
    //     />
    // );

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
                    {/* <div className="grow"></div>
                    <ExportButton onExport={() => exportToCsv(gridElement, "Players.csv")}>Export to CSV</ExportButton>
                    <div className="px-1"></div>
                    <ExportButton onExport={() => exportToXlsx(gridElement, "Players.xlsx")}>
                        Export to XSLX
                    </ExportButton>
                    <div className="px-1"></div>
                    <ExportButton onExport={() => exportToPdf(gridElement, "Players.pdf")}>Export to PDF</ExportButton> */}
                </div>
                <PlayerCreate isOpen={createVisible} onCancel={() => toggleCreateVisible()} onCreate={() => {}} />
                <PlayerEdit
                    isOpen={editVisible}
                    onCancel={() => toggleEditVisible()}
                    onEdit={() => {}}
                    editedPlayer={edited}
                />
                {/* {gridElement} */}
                {players && (
                    <DataGrid
                        className="h-full"
                        defaultColumnOptions={{
                            sortable: true,
                            resizable: true
                        }}
                        onRowDoubleClick={e => toggleEditVisible(e)}
                        columns={columns}
                        rows={players}
                    />
                )}
            </div>
        </>
    );
};

export default StartingList;
