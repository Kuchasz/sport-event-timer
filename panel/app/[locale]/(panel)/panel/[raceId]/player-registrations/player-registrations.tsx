"use client";
import Head from "next/head";
import Icon from "@mdi/react";
import { AgGridReact } from "@ag-grid-community/react";
import { Button } from "components/button";
import { Confirmation } from "../../../../../../components/confirmation";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../../../../trpc-core";
import { mdiAccountPlusOutline, mdiCashCheck, mdiCashRemove, mdiCheck, mdiClose, mdiExport, mdiPlus, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "../../../../../../components/modal";
import { useCurrentRaceId } from "../../../../../../hooks";
import { PlayerRegistrationCreate } from "components/player-registration-create";
import { PlayerRegistrationEdit } from "components/player-registration-edit";
import { PlayerRegistrationPromotion } from "components/player-registration-promotion";
import classNames from "classnames";
import { ColDef } from "@ag-grid-community/core";
import { useCallback, useRef } from "react";
import { PoorColumnChooser } from "components/poor-column-chooser";
import { useAtom } from "jotai";
import { getGridColumnStateAtom } from "states/grid-states";
import { GenderIcon } from "components/gender-icon";
import { Gender } from "@set/timer/dist/model";
import { PoorActions } from "components/poor-actions";
import { PageHeader } from "components/page-header";

type PlayerRegistration = AppRouterOutputs["playerRegistration"]["registrations"][0];
type CreatedPlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];
type EditedPlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];
type PlayerRegistrationPromotion = AppRouterInputs["player"]["promoteRegistration"]["player"];

const PaymentRenderer = (props: any) => <PlayerRegistrationPayment refetch={props.context.refetch} playerRegistration={props.data} />;
const PromotedToPlayerRenderer = (props: any) => <PlayerRegistrationPromotedToPlayer playerRegistration={props.data} />;

const PlayerRegistrationPromotedToPlayer = ({ playerRegistration }: { playerRegistration: PlayerRegistration }) => {
    return (
        <span
            className={classNames("flex h-full items-center hover:text-black", {
                ["text-green-600 font-semibold"]: playerRegistration.promotedToPlayer,
                ["text-red-600"]: !playerRegistration.promotedToPlayer,
            })}
        >
            {playerRegistration.promotedToPlayer ? <Icon size={1} path={mdiCheck} /> : <Icon size={1} path={mdiClose} />}
        </span>
    );
};

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

export const PlayerRegistrations = () => {
    const raceId = useCurrentRaceId();
    const { data: registrations, refetch } = trpc.playerRegistration.registrations.useQuery({ raceId: raceId! }, { initialData: [] });
    const addPlayerRegistrationMutation = trpc.playerRegistration.add.useMutation();
    const editPlayerRegistrationMutation = trpc.playerRegistration.edit.useMutation();
    const gridRef = useRef<AgGridReact<PlayerRegistration>>(null);
    const deletePlayerMutation = trpc.playerRegistration.delete.useMutation();
    const promotePlayerRegistration = trpc.player.promoteRegistration.useMutation();
    const utils = trpc.useContext();

    const promoteToPlayerAction = {
        name: "Promote to Player",
        description: "Promoted player will be available in stopwatch",
        iconPath: mdiAccountPlusOutline,
        execute: async (playerRegistration: PlayerRegistration) => {
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
        },
    };

    const deleteRegistrationAction = {
        name: "Delete registered Player",
        description: "It is permanent action",
        iconPath: mdiTrashCan,
        execute: async (playerRegistration: PlayerRegistration) => {
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
        },
    };

    const defaultColumns: ColDef<PlayerRegistration>[] = [
        {
            field: "index",
            width: 25,
            headerName: "Index",
            headerClass: "hidden",
            valueGetter: "node.rowIndex + 1",
            sortable: false,
            filter: false,
        },
        { field: "name", headerName: "Name", flex: 1, sortable: true, resizable: true, filter: true },
        { field: "lastName", headerName: "Last Name", flex: 1, sortable: true, resizable: true, filter: true },
        {
            field: "gender",
            headerName: "Gender",
            sortable: true,
            filter: true,
            cellStyle: { justifyContent: "center", display: "flex" },
            resizable: true,
            maxWidth: 120,
            cellRenderer: (props: { data: PlayerRegistration }) => <GenderIcon gender={props.data.gender as Gender} />,
        },
        {
            field: "birthDate",
            headerName: "Birth Date",
            resizable: true,
            cellRenderer: (props: any) => <div>{props.data.birthDate.toLocaleDateString()}</div>,
            sortable: true,
            hide: true,
            maxWidth: 120,
        },
        { field: "country", headerName: "Country", resizable: true, sortable: true, filter: true, maxWidth: 150, hide: true }, // width: 10 },
        { field: "city", headerName: "City", resizable: true, sortable: true, filter: true, hide: true }, // width: 20 },
        {
            field: "team",
            headerName: "Team",
            flex: 1,
            sortable: true,
            resizable: true,
            filter: true,
            cellRenderer: (props: any) => <div className="text-ellipsis">{props.data.team}</div>,
        },
        { field: "phoneNumber", headerName: "Phone", resizable: true, filter: true, hide: true }, // width: 20 },
        { field: "email", headerName: "E-mail", resizable: true, filter: true, hide: true }, // width: 20 },
        { field: "icePhoneNumber", headerName: "ICE Number", resizable: true, filter: true, hide: true }, // width: 20 },
        {
            field: "registrationDate",
            headerName: "Registered",
            maxWidth: 120,
            resizable: true,
            sortable: true,
            cellRenderer: (props: any) => <div>{props.data.registrationDate.toLocaleDateString()}</div>,
        },
        { field: "paymentDate", headerName: "Payment", sortable: true, resizable: true, maxWidth: 140, cellRenderer: PaymentRenderer },
        {
            field: "promotedToPlayer",
            headerName: "Promoted",
            sortable: true,
            filter: true,
            resizable: true,
            width: 130,
            cellRenderer: PromotedToPlayerRenderer,
        },
        {
            field: "actions",
            resizable: true,
            width: 130,
            headerName: "Actions",
            cellRenderer: (props: { data: PlayerRegistration; context: { refetch: () => void } }) => (
                <PoorActions
                    item={props.data}
                    actions={props.data.promotedToPlayer ? [deleteRegistrationAction] : [promoteToPlayerAction, deleteRegistrationAction]}
                />
            ),
        },
    ];

    const [gridColumnState, setGridColumnState] = useAtom(
        getGridColumnStateAtom(
            "player-registrations",
            defaultColumns.map(c => ({ hide: c.hide, colId: c.field! }))
        )
    );

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
        gridColumnState && gridRef.current?.columnApi.applyColumnState({ state: gridColumnState });
        // gridRef.current?.api.sizeColumnsToFit();
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
                <title>Player registrations</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <PageHeader title="Registered players" description="Players registered for the race, may be promoted to players" />
                <div className="mb-4 flex">
                    <Button onClick={openCreateDialog}>
                        <Icon size={1} path={mdiPlus} />
                        <span className="ml-2">Register Player</span>
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
                        <span className="ml-2">Export</span>
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
                </div>
                <div className="ag-theme-material h-full">
                    <AgGridReact<PlayerRegistration>
                        ref={gridRef}
                        context={{ refetch }}
                        onRowDoubleClicked={e => openEditDialog(e.data)}
                        suppressCellFocus={true}
                        suppressAnimationFrame={true}
                        suppressColumnVirtualisation={true}
                        columnDefs={defaultColumns}
                        rowData={registrations}
                        onFirstDataRendered={onFirstDataRendered}
                        onGridSizeChanged={onFirstDataRendered}
                    ></AgGridReact>
                </div>
            </div>
        </>
    );
};
