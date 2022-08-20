import DataGrid, { Column } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Confirmation } from "../../components/confirmation";
import { Demodal } from "demodal";
import { InferMutationInput, InferQueryOutput, trpc } from "../../trpc";
import { mdiAccountSyncOutline, mdiPlus, mdiTrashCan } from "@mdi/js";
import { milisecondsToTimeString } from "../../utils";
import { NiceModal } from "../../components/modal";
import { PlayerCreate } from "../../components/player-create";
import { PlayerEdit } from "components/player-edit";
import { useCurrentRaceId } from "../../hooks";


type Player = InferQueryOutput<"player.players">[0];
type CreatedPlayer = InferMutationInput<"player.add">["player"];
type EditedPlayer = InferMutationInput<"player.add">["player"];

const columns: Column<Player, unknown>[] = [
    { key: "id", name: "Id", width: 10, sortable: false, resizable: false },
    {
        key: "classificationId",
        name: "Classification Id"
    },
    {
        key: "bibNumber",
        name: "Bib Number"
    },
    { key: "name", name: "Name" },
    { key: "lastName", name: "Last Name" },
    {
        key: "gender",
        name: "Gender",
        width: 10
    },
    {
        key: "startTime",
        name: "Start Time",
        formatter: props => <div>{milisecondsToTimeString(props.row.startTime)}</div>
    },
    { key: "birthDate", name: "Birth Date", formatter: props => <div>{props.row.birthDate.toLocaleDateString()}</div> },
    { key: "country", name: "Country", width: 10 },
    { key: "city", name: "City" },
    { key: "team", name: "Team" },
    { key: "email", name: "Email" },
    { key: "phoneNumber", name: "Phone Number" },
    { key: "icePhoneNumber", name: "Ice Phone Number" },
    {
        key: "actions",
        width: 15,
        name: "Actions",
        formatter: props => <PlayerDeleteButton player={props.row} />
    }
];

const PlayerDeleteButton = ({ player }: { player: Player }) => {
    const raceId = useCurrentRaceId();
    const { refetch } = trpc.useQuery(["player.players", { raceId: raceId! }]);
    const deletePlayerMutation = trpc.useMutation(["player.delete"]);
    const deletePlayer = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete player`,
            component: Confirmation,
            props: {
                message: `You are trying to delete the Player ${player.name} ${player.lastName}. Do you want to proceed?`
            }
        });

        if (confirmed) {
            await deletePlayerMutation.mutateAsync({ playerId: player.id });
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
    const pushPlayersMutation = trpc.useMutation(["player.push-players"]);

    const pushPlayersToTimer = async () => {
        pushPlayersMutation.mutate({ raceId: raceId! });
    };

    const openCreateDialog = async () => {
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

    const openEditDialog = async (editedPlayer?: Player) => {
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
                {/* <div className="pb-4">
                    <h1 className="text-xl font-semibold uppercase">Players</h1>
                    <div className="flex-grow max-w-xs border-t-2 mt-2 border-pink-400"></div>
                </div> */}
                <div className="mb-4 flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                    <div className="px-1"></div>
                    <Button onClick={pushPlayersToTimer} autoCapitalize="false">
                        <Icon size={1} path={mdiAccountSyncOutline} />
                        <span className="ml-2">Push to Stopwatch</span>
                    </Button>
                    {/* <div className="px-1"></div>
                    <Button autoCapitalize="false">
                        <Icon size={1} path={mdiNumeric} />
                        <span className="ml-2">Set numbers</span>
                    </Button> */}

                    {/* <div className="grow"></div>
                    <ExportButton onExport={() => exportToCsv(gridElement, "Players.csv")}>Export to CSV</ExportButton>
                    <div className="px-1"></div>
                    <ExportButton onExport={() => exportToXlsx(gridElement, "Players.xlsx")}>
                        Export to XSLX
                    </ExportButton>
                    <div className="px-1"></div>
                    <ExportButton onExport={() => exportToPdf(gridElement, "Players.pdf")}>Export to PDF</ExportButton> */}
                </div>
                {/* {gridElement} */}
                {players && (
                    <DataGrid className='rdg-light h-full'
                        defaultColumnOptions={{
                            sortable: true,
                            resizable: true
                        }}
                        onRowDoubleClick={e => openEditDialog(e)}
                        columns={columns}
                        rows={players}
                    />
                )}
            </div>
        </>
    );
};

export default Players;
