// import DataGrid, { Column } from "react-data-grid";
import Head from "next/head";
import Icon from "@mdi/react";
import { AgGridReact } from "@ag-grid-community/react";
import { Button } from "components/button";
import { Confirmation } from "../../../components/confirmation";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../connection";
import { mdiAccountPlusOutline, mdiCashCheck, mdiCashRemove, mdiExport, mdiPlus, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "../../../components/modal";
import { useCurrentRaceId } from "../../../hooks";
import { PlayerRegistrationCreate } from "components/player-registration-create";
import { PlayerRegistrationEdit } from "components/player-registration-edit";
import { PlayerRegistrationPromotion } from "components/player-registration-promotion";
import classNames from "classnames";
import { ColDef } from "@ag-grid-community/core";
import { useCallback, useRef } from "react";
import { PoorColumnChooser } from "components/poor-column-chooser";
import { useAtom } from "jotai";
import { getGridColumnStateAtom } from "states/grid-states";

type PlayerRegistration = AppRouterOutputs["playerRegistration"]["registrations"][0];
type CreatedPlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];
type EditedPlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];
type PlayerRegistrationPromotion = AppRouterInputs["player"]["promoteRegistration"]["player"];

const ActionsRenderer = (props: any) => <PlayerRegistrationActions refetch={props.context.refetch} playerRegistration={props.data} />;
const PaymentRenderer = (props: any) => <PlayerRegistrationPayment refetch={props.context.refetch} playerRegistration={props.data} />;

const defaultColumns: ColDef<PlayerRegistration>[] = [
    { field: "index", headerName: "Index", headerClass: "hidden", sortable: false, resizable: false, width: 25 }, //, width: 5 },
    { field: "name", headerName: "Name", sortable: true, resizable: true, filter: true },
    { field: "lastName", headerName: "Last Name", sortable: true, resizable: true, filter: true },
    {
        field: "gender",
        headerName: "Gender",
        sortable: true,
        resizable: true,
        cellStyle: { justifyContent: "center", display: "flex" },
        width: 150,
        cellRenderer: (props: any) =>
            props.data.gender === "male" ? (
                <div className="h-full flex items-center">
                    <div className="flex items-center justify-center bg-blue-500 h-7 w-7 text-center text-white rounded-full font-bold">
                        M
                    </div>
                </div>
            ) : (
                <div className="h-full flex items-center">
                    <div className="flex items-center justify-center bg-red-500 h-7 w-7 text-center text-white rounded-full font-bold">
                        F
                    </div>
                </div>
            ),
    },
    {
        field: "birthDate",
        headerName: "Birth Date",
        resizable: true,
        cellRenderer: (props: any) => <div>{props.data.birthDate.toLocaleDateString()}</div>,
        sortable: true,
        hide: true,
    },
    { field: "country", headerName: "Country", resizable: true, width: 150, hide: true }, // width: 10 },
    { field: "city", headerName: "City", resizable: true, hide: true }, // width: 20 },
    {
        field: "team",
        headerName: "Team",
        sortable: true,
        resizable: true,
        filter: true,
        cellRenderer: (props: any) => <div className="text-ellipsis">{props.data.team}</div>,
    },
    { field: "phoneNumber", headerName: "Phone", resizable: true, hide: true }, // width: 20 },
    { field: "email", headerName: "E-mail", resizable: true, hide: true }, // width: 20 },
    { field: "icePhoneNumber", headerName: "ICE Number", resizable: true, hide: true }, // width: 20 },
    {
        field: "registrationDate",
        headerName: "Registration Date",
        // width: 30,
        resizable: true,
        cellRenderer: (props: any) => <div>{props.data.registrationDate.toLocaleDateString()}</div>,
    },
    { field: "paymentDate", headerName: "Payment", sortable: true, resizable: true, cellRenderer: PaymentRenderer },
    {
        field: "actions",
        // width: 50,
        headerName: "Actions",
        cellRenderer: ActionsRenderer,
    },
];

const PlayerRegistrationPayment = ({ playerRegistration, refetch }: { playerRegistration: PlayerRegistration; refetch: () => {} }) => {
    const setPaymentStatusMutation = trpc.playerRegistration.setPaymentStatus.useMutation();

    const togglePlayerPayment = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Confirm payment change`,
            component: Confirmation,
            props: {
                message: `You are trying to change ${playerRegistration.name} ${playerRegistration.lastName} payment status to: ${
                    playerRegistration.hasPaid ? "not paid" : "paid"
                }. Do you want to proceed?`,
            },
        });

        if (confirmed) {
            await setPaymentStatusMutation.mutateAsync({ playerId: playerRegistration.id, hasPaid: !playerRegistration.hasPaid });
            refetch();
        }
    };
    return (
        <span
            className={classNames("flex h-full items-center hover:text-black cursor-pointer", {
                ["text-green-600 font-semibold"]: playerRegistration.paymentDate !== null,
                ["text-red-600"]: playerRegistration.paymentDate === null,
            })}
            onClick={togglePlayerPayment}
        >
            {playerRegistration.hasPaid ? <Icon size={1} path={mdiCashCheck} /> : <Icon size={1} path={mdiCashRemove} />}
            <span className="ml-2">{playerRegistration.paymentDate?.toLocaleDateString() ?? "not paid"}</span>
        </span>
    );
};

const PlayerRegistrationActions = ({ playerRegistration, refetch }: { playerRegistration: PlayerRegistration; refetch: () => {} }) => {
    const raceId = useCurrentRaceId();
    const deletePlayerMutation = trpc.playerRegistration.delete.useMutation();
    const promotePlayerRegistration = trpc.player.promoteRegistration.useMutation();
    const utils = trpc.useContext();

    const openDeleteDialog = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: `Delete player registration`,
            component: Confirmation,
            props: {
                message: `You are trying to delete the Player Registration ${playerRegistration.name} ${playerRegistration.lastName}. Do you want to proceed?`,
            },
        });

        if (confirmed) {
            await deletePlayerMutation.mutateAsync({ playerId: playerRegistration.id });
            refetch();
        }
    };

    const openPromoteMutation = async () => {
        const player = await Demodal.open<PlayerRegistrationPromotion>(NiceModal, {
            title: "Promote player registration to player",
            component: PlayerRegistrationPromotion,
            props: {
                raceId: raceId!,
            },
        });

        if (player) {
            await promotePlayerRegistration.mutateAsync({ raceId: raceId!, registrationId: playerRegistration.id, player });

            utils.player.lastAvailableBibNumber.invalidate({ raceId: raceId! });
            utils.player.lastAvailableStartTime.invalidate({ raceId: raceId! });

            refetch();
        }
    };

    return (
        <div className="flex h-full">
            {!playerRegistration.promotedToPlayer && (
                <span className="flex px-2 items-center hover:text-red-600 cursor-pointer" onClick={openPromoteMutation}>
                    <Icon size={1} path={mdiAccountPlusOutline} />
                </span>
            )}
            <span className="flex px-2 items-center hover:text-red-600 cursor-pointer" onClick={openDeleteDialog}>
                <Icon size={1} path={mdiTrashCan} />
            </span>
        </div>
    );
};

const PlayerRegistrations = () => {
    const raceId = useCurrentRaceId();
    const { data: registrations, refetch } = trpc.playerRegistration.registrations.useQuery({ raceId: raceId! }, { initialData: [] });
    const addPlayerRegistrationMutation = trpc.playerRegistration.add.useMutation();
    const editPlayerRegistrationMutation = trpc.playerRegistration.edit.useMutation();
    const gridRef = useRef<AgGridReact<PlayerRegistration>>(null);
    const [gridColumnState, setGridColumnState] = useAtom(
        getGridColumnStateAtom(
            "player-registrations",
            defaultColumns.map(c => ({ hide: c.hide, colId: c.field! }))
        )
    );

    const columns = gridColumnState;

    const openCreateDialog = async () => {
        const player = await Demodal.open<CreatedPlayerRegistration>(NiceModal, {
            title: "Create new player registration",
            component: PlayerRegistrationCreate,
            props: {
                raceId: raceId!,
            },
        });

        if (player) {
            await addPlayerRegistrationMutation.mutateAsync({ raceId: raceId!, player });
            refetch();
        }
    };

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.columnApi.applyColumnState({ state: gridColumnState });
        gridRef.current?.api.sizeColumnsToFit();
    }, [gridColumnState]);

    const openEditDialog = async (editedPlayerRegistration?: PlayerRegistration) => {
        const playerRegistration = await Demodal.open<EditedPlayerRegistration>(NiceModal, {
            title: "Edit player registration",
            component: PlayerRegistrationEdit,
            props: {
                raceId: raceId!,
                editedPlayerRegistration,
            },
        });

        if (playerRegistration) {
            await editPlayerRegistrationMutation.mutateAsync({ raceId: raceId!, player: playerRegistration });
            refetch();
        }
    };

    return (
        <>
            <Head>
                <title>Rejestracje zawodników</title>
            </Head>

            <div className="ag-theme-material border-1 flex flex-col h-full border-gray-600 border-solid">
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
                            const notSelectedColumns = columns.map(c => c.colId).filter(c => !e.target.value.includes(c));

                            gridRef.current?.columnApi.setColumnsVisible(notSelectedColumns as string[], false);
                            gridRef.current?.columnApi.setColumnsVisible(visibleColumns, true);
                            gridRef.current?.api.sizeColumnsToFit();

                            const saveState = gridRef.current?.columnApi.getColumnState()!.map(({ colId, hide }) => ({ colId, hide }))!;

                            setGridColumnState(saveState);
                        }}
                    />
                </div>

                <AgGridReact<PlayerRegistration>
                    ref={gridRef}
                    context={{ refetch }}
                    onRowDoubleClicked={e => openEditDialog(e.data)}
                    suppressCellFocus={true}
                    suppressAnimationFrame={true}
                    columnDefs={defaultColumns}
                    rowData={registrations}
                    onFirstDataRendered={onFirstDataRendered}
                    onGridSizeChanged={onFirstDataRendered}
                ></AgGridReact>
            </div>
        </>
    );
};

export default PlayerRegistrations;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
