import Head from "next/head";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { Confirmation } from "../../../components/confirmation";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../connection";
import { mdiExport, mdiPlus, mdiTrashCan } from "@mdi/js";
import { milisecondsToTimeString } from "@set/utils/dist/datetime";
import { NiceModal } from "../../../components/modal";
import { PlayerCreate } from "../../../components/player-create";
import { PlayerEdit } from "components/player-edit";
import { useCurrentRaceId } from "../../../hooks";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { getGridColumnStateAtom } from "states/grid-states";
import { useAtom } from "jotai";
import { useCallback, useRef } from "react";
import { PoorColumnChooser } from "components/poor-column-chooser";
import { Gender } from "@set/timer/dist/model";
import { GenderIcon } from "components/gender-icon";

type Player = AppRouterOutputs["player"]["players"][0];
type CreatedPlayer = AppRouterInputs["player"]["add"]["player"];
type EditedPlayer = AppRouterInputs["player"]["add"]["player"];

const defaultColumns: ColDef<Player>[] = [
    {
        field: "index",
        width: 25,
        headerName: "Index",
        headerClass: "hidden",
        valueGetter: "node.rowIndex + 1",
        sortable: false,
        filter: false,
    },
    {
        field: "classificationId",
        headerName: "Classification Id",
    },
    {
        field: "bibNumber",
        headerName: "Bib Number",
        sort: "asc",
        comparator: (valueA, valueB) => valueA - valueB,
        filter: true,
        sortable: true,
    },
    { field: "name", headerName: "Name", sortable: true, filter: true },
    { field: "lastName", headerName: "Last Name", sortable: true, filter: true },
    {
        field: "gender",
        headerName: "Gender",
        sortable: true,
        filter: true,
        resizable: true,
        cellStyle: { justifyContent: "center", display: "flex" },
        width: 150,
        cellRenderer: (props: { data: Player }) => <GenderIcon gender={props.data.gender as Gender} />,
    },
    {
        field: "startTime",
        headerName: "Start Time",
        sortable: true,
        cellRenderer: (props: { data: Player }) => <div>{milisecondsToTimeString(props.data.startTime)}</div>,
    },
    {
        field: "birthDate",
        headerName: "Birth Date",
        sortable: true,
        hide: true,
        cellRenderer: (props: { data: Player }) => <div>{props.data.birthDate.toLocaleDateString()}</div>,
    },
    { field: "country", headerName: "Country", width: 10, sortable: true, filter: true, hide: true },
    { field: "city", headerName: "City", sortable: true, filter: true, hide: true },
    { field: "team", headerName: "Team", sortable: true, filter: true, hide: true },
    { field: "email", headerName: "Email", sortable: true, filter: true, hide: true },
    { field: "phoneNumber", headerName: "Phone Number", sortable: true, filter: true, hide: true },
    { field: "icePhoneNumber", headerName: "Ice Phone Number", sortable: true, filter: true, hide: true },
    {
        field: "actions",
        // width: 15,
        headerName: "Actions",
        cellRenderer: (props: { context: any; data: Player }) => <PlayerDeleteButton refetch={props.context.refetch} player={props.data} />,
    },
];

const PlayerDeleteButton = ({ player, refetch }: { player: Player; refetch: () => void }) => {
    const deletePlayerMutation = trpc.player.delete.useMutation();
    const deletePlayer = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete player`,
            component: Confirmation,
            props: {
                message: `You are trying to delete the Player ${player.name} ${player.lastName}. Do you want to proceed?`,
            },
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

const Players = () => {
    const raceId = useCurrentRaceId();
    const { data: players, refetch } = trpc.player.players.useQuery({ raceId: raceId! });
    const addPlayerMutation = trpc.player.add.useMutation();
    const editPlayerMutation = trpc.player.edit.useMutation();
    const gridRef = useRef<AgGridReact<Player>>(null);
    const [gridColumnState, setGridColumnState] = useAtom(
        getGridColumnStateAtom(
            "players",
            defaultColumns.map(c => ({ hide: c.hide, colId: c.field! }))
        )
    );

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.columnApi.applyColumnState({ state: gridColumnState });
        gridRef.current?.api.sizeColumnsToFit();
    }, [gridColumnState]);

    const openCreateDialog = async () => {
        const player = await Demodal.open<CreatedPlayer>(NiceModal, {
            title: "Create new player",
            component: PlayerCreate,
            props: {
                raceId: raceId!,
            },
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
                editedPlayer,
            },
        });

        if (player) {
            await editPlayerMutation.mutateAsync({ raceId: raceId!, player });
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>Lista zawodników</title>
            </Head>

            <div className="ag-theme-material border-1 flex flex-col h-full border-gray-600 border-solid">
                {/* <div className="pb-4">
                    <h1 className="text-xl font-semibold uppercase">Players</h1>
                    <div className="flex-grow max-w-xs border-t-2 mt-2 border-pink-400"></div>
                </div> */}
                <div className="mb-4 flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                    <Button
                        className="ml-2"
                        onClick={() => {
                            gridRef.current?.api.exportDataAsCsv({
                                fileName: `player-registrations-${new Date().toLocaleDateString()}.csv`,
                            });
                        }}
                    >
                        <Icon size={1} path={mdiExport} />
                        <span className="ml-2">export</span>
                    </Button>
                    <PoorColumnChooser
                        items={defaultColumns}
                        initialValue={gridColumnState.filter(c => !c.hide).map(c => c.colId)}
                        valueKey="field"
                        nameKey="headerName"
                        onChange={e => {
                            const visibleColumns = e.target.value as string[];
                            const notSelectedColumns = gridColumnState.map(c => c.colId).filter(c => !e.target.value.includes(c));

                            gridRef.current?.columnApi.setColumnsVisible(notSelectedColumns as string[], false);
                            gridRef.current?.columnApi.setColumnsVisible(visibleColumns, true);
                            gridRef.current?.api.sizeColumnsToFit();

                            const saveState = gridRef.current?.columnApi.getColumnState()!.map(({ colId, hide }) => ({ colId, hide }))!;

                            setGridColumnState(saveState);
                        }}
                    />
                    {/* <div className="px-1"></div>
                    <Button autoCapitalize="false">
                        <Icon size={1} path={mdiNumeric} />
                        <span className="ml-2">Set numbers</span>
                    </Button> */}
                </div>
                {/* {gridElement} */}
                {players && (
                    <AgGridReact<Player>
                        ref={gridRef}
                        context={{ refetch }}
                        onRowDoubleClicked={e => openEditDialog(e.data)}
                        suppressCellFocus={true}
                        suppressAnimationFrame={true}
                        columnDefs={defaultColumns}
                        rowData={players}
                        onFirstDataRendered={onFirstDataRendered}
                        onGridSizeChanged={onFirstDataRendered}
                    ></AgGridReact>
                )}
            </div>
        </>
    );
};

export default Players;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
