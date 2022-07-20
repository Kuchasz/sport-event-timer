import DataGrid, { Column, FormatterProps, SortColumn } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "react-daisyui";
import { CurrentRaceContext } from "../current-race-context";
import { Demodal } from "demodal";
import { exportToCsv, exportToPdf, exportToXlsx } from "exportUtils";
import { InferMutationInput, InferQueryOutput, trpc } from "../trpc";
import { mdiAccountMultiplePlus, mdiNumeric, mdiPlus } from "@mdi/js";
import { NiceModal } from "../components/modal";
import { PlayerCreate } from "../components/player-create";
import { PlayerEdit } from "components/player-edit";
import { useContext, useState } from "react";
import { useCurrentRaceId } from "../use-current-race-id";

type Player = InferQueryOutput<"player.players">[0];
type CreatedPlayer = InferMutationInput<"player.add">["player"];
type EditedPlayer = InferMutationInput<"player.add">["player"];

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
    { key: "birthDate", name: "Birth Date", formatter: props => <div>{props.row.birthDate.toLocaleDateString()}</div> },
    { key: "country", name: "Country", width: 10 },
    { key: "city", name: "City" },
    { key: "team", name: "Team" },
    { key: "email", name: "Email" },
    { key: "phoneNumber", name: "Phone Number" },
    { key: "icePhoneNumber", name: "Ice Phone Number" }
];

// const ExportButton = ({ onExport, children }: { onExport: () => Promise<unknown>; children: React.ReactChild }) => {
//     const [exporting, setExporting] = useState(false);
//     return (
//         <Button
//             disabled={exporting}
//             loading={exporting}
//             onClick={async () => {
//                 setExporting(true);
//                 await onExport();
//                 setExporting(false);
//             }}
//         >
//             {exporting ? "Exporting" : children}
//         </Button>
//     );
// };

const Players = () => {
    const raceId = useCurrentRaceId();
    const { data: players, refetch } = trpc.useQuery(["player.players", { raceId: raceId! }]);
    const addPlayerMutation = trpc.useMutation(["player.add"]);
    const editPlayerMutation = trpc.useMutation(["player.edit"]);

    const toggleCreateVisible = async () => {
        const player = await Demodal.open<CreatedPlayer>(NiceModal, {
            title: "Create new player",
            component: PlayerCreate,
            props: {
                raceId: raceId!
            }
        });

        if (player) {
            await addPlayerMutation.mutateAsync({ raceId: raceId!, player });
            refetch();
        }
    };

    const toggleEditVisible = async (editedPlayer?: Player) => {
        const player = await Demodal.open<EditedPlayer>(NiceModal, {
            title: "Edit player",
            component: PlayerEdit,
            props: {
                raceId: raceId!,
                editedPlayer
            }
        });

        if (player) {
            await editPlayerMutation.mutateAsync({ raceId: raceId!, player });
            refetch();
        }
    };

    // const playerCreate = async (player: CreatedPlayer) => {
    //     await addPlayerMutation.mutateAsync(player);
    //     toggleCreateVisible();
    //     refetch();
    // };

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
                        Import
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
                {/* {createVisible && (
                    <Modal />
                    // <PlayerCreate
                    //     raceId={raceId!}
                    //     isOpen={createVisible}
                    //     onCancel={() => toggleCreateVisible()}
                    //     onCreate={playerCreate}
                    // />
                )} */}
                {/* {edited && (
                    <PlayerEdit
                        isOpen={editVisible}
                        onCancel={() => toggleEditVisible()}
                        onEdit={() => {}}
                        editedPlayer={edited}
                    />
                )} */}
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

export default Players;
