"use client";
import Head from "next/head";
import Icon from "@mdi/react";
import { AgGridReact } from "@ag-grid-community/react";
import { Button } from "components/button";
import { Confirmation } from "../../../../../components/confirmation";
import { Demodal } from "demodal";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { trpc } from "../../../../../trpc-core";
import { mdiAccountPlusOutline, mdiCashCheck, mdiCashRemove, mdiCheck, mdiClose, mdiExport, mdiPlus, mdiTrashCan } from "@mdi/js";
import { NiceModal } from "../../../../../components/modal";
import { useCurrentRaceId } from "../../../../../hooks";
import { PlayerRegistrationCreate } from "components/panel/player-registration/player-registration-create";
import { PlayerRegistrationEdit } from "components/panel/player-registration/player-registration-edit";
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
import { useTranslations } from "next-intl";
import { refreshRow } from "ag-grid";

type PlayerRegistration = AppRouterOutputs["playerRegistration"]["registrations"][0];
type CreatedPlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];
type EditedPlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];
type PlayerRegistrationPromotion = AppRouterInputs["player"]["promoteRegistration"]["player"];

const PaymentRenderer = (props: any) => (
    <PlayerRegistrationPayment
        refreshRegistrationRow={props.context.refreshRegistrationRow}
        refetch={props.context.refetch}
        playerRegistration={props.data}
    />
);
const PromotedToPlayerRenderer = (props: any) => <PlayerRegistrationPromotedToPlayer playerRegistration={props.data} />;

const PlayerRegistrationPromotedToPlayer = ({ playerRegistration }: { playerRegistration: PlayerRegistration }) => {
    return (
        <span
            className={classNames("flex h-full items-center hover:text-black", {
                ["font-semibold text-green-600"]: playerRegistration.promotedToPlayer,
                ["text-red-600"]: !playerRegistration.promotedToPlayer,
            })}
        >
            {playerRegistration.promotedToPlayer ? <Icon size={0.8} path={mdiCheck} /> : <Icon size={0.8} path={mdiClose} />}
        </span>
    );
};

const PlayerRegistrationPayment = ({
    playerRegistration,
    refetch,
    refreshRegistrationRow,
}: {
    playerRegistration: PlayerRegistration;
    refetch: () => {};
    refreshRegistrationRow: (itemId: string) => void;
}) => {
    const setPaymentStatusMutation = trpc.playerRegistration.setPaymentStatus.useMutation();
    const t = useTranslations();

    const togglePlayerPayment = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: t("pages.playerRegistrations.togglePlayerPayment.confirmation.title"),
            component: Confirmation,
            props: {
                message: t("pages.playerRegistrations.togglePlayerPayment.confirmation.text", {
                    name: playerRegistration.name,
                    lastName: playerRegistration.lastName,
                    hasPaid: playerRegistration.hasPaid
                        ? t("pages.playerRegistrations.payment.status.notPaid")
                        : t("pages.playerRegistrations.payment.status.paid"),
                }),
            },
        });

        if (confirmed) {
            await setPaymentStatusMutation.mutateAsync({ playerId: playerRegistration.id, hasPaid: !playerRegistration.hasPaid });
            await refetch();
            refreshRegistrationRow(playerRegistration.id.toString());
        }
    };
    return (
        <span
            className={classNames("flex h-full cursor-pointer items-center hover:text-black", {
                ["font-semibold text-green-600"]: playerRegistration.paymentDate !== null,
                ["text-red-600"]: playerRegistration.paymentDate === null,
            })}
            onClick={togglePlayerPayment}
        >
            {playerRegistration.hasPaid ? <Icon size={0.8} path={mdiCashCheck} /> : <Icon size={0.8} path={mdiCashRemove} />}
            <span className="ml-2">
                {playerRegistration.paymentDate?.toLocaleDateString() ?? t("pages.playerRegistrations.payment.status.notPaid")}
            </span>
        </span>
    );
};

export const PlayerRegistrations = () => {
    const raceId = useCurrentRaceId();
    const t = useTranslations();
    const { data: registrations, refetch } = trpc.playerRegistration.registrations.useQuery({ raceId: raceId! }, { initialData: [] });
    const gridRef = useRef<AgGridReact<PlayerRegistration>>(null);
    const deletePlayerMutation = trpc.playerRegistration.delete.useMutation();
    const promotePlayerRegistration = trpc.player.promoteRegistration.useMutation();
    const utils = trpc.useContext();

    const promoteToPlayerAction = {
        name: t("pages.playerRegistrations.promoteToPlayer.title"),
        description: t("pages.playerRegistrations.promoteToPlayer.description"),
        iconPath: mdiAccountPlusOutline,
        execute: async (playerRegistration: PlayerRegistration) => {
            const player = await Demodal.open<PlayerRegistrationPromotion>(NiceModal, {
                title: t("pages.playerRegistrations.promoteToPlayer.confirmation.title"),
                component: PlayerRegistrationPromotion,
                props: {
                    raceId: raceId!,
                },
            });

            if (player) {
                await promotePlayerRegistration.mutateAsync({ raceId: raceId!, registrationId: playerRegistration.id, player });

                utils.player.lastAvailableBibNumber.invalidate({ raceId: raceId! });
                utils.player.lastAvailableStartTime.invalidate({ raceId: raceId! });

                await refetch();
                refreshRegistrationRow(playerRegistration.id.toString());
            }
        },
    };

    const refreshRegistrationRow = (itemId: string) => {
        refreshRow(gridRef, itemId);
    };

    const deleteRegistrationAction = {
        name: t("pages.playerRegistrations.delete.title"),
        description: t("pages.playerRegistrations.delete.description"),
        iconPath: mdiTrashCan,
        execute: async (playerRegistration: PlayerRegistration) => {
            const confirmed = await Demodal.open<boolean>(NiceModal, {
                title: t("pages.playerRegistrations.delete.confirmation.title"),
                component: Confirmation,
                props: {
                    message: t("pages.playerRegistrations.delete.confirmation.text", {
                        name: playerRegistration.name,
                        lastName: playerRegistration.lastName,
                    }),
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
            width: 25,
            headerName: t("pages.playerRegistrations.grid.columns.index"),
            headerClass: "hidden",
            sortable: false,
            filter: false,
            valueGetter: r => r.node?.rowIndex,
        },
        {
            field: "name",
            headerName: t("pages.playerRegistrations.grid.columns.name"),
            flex: 1,
            sortable: true,
            resizable: true,
            filter: true,
        },
        {
            field: "lastName",
            headerName: t("pages.playerRegistrations.grid.columns.lastName"),
            flex: 1,
            sortable: true,
            resizable: true,
            filter: true,
        },
        {
            field: "gender",
            headerName: t("pages.playerRegistrations.grid.columns.gender"),
            sortable: true,
            filter: true,
            cellStyle: { justifyContent: "center", display: "flex" },
            resizable: true,
            maxWidth: 120,
            cellRenderer: (props: { data: PlayerRegistration }) => <GenderIcon gender={props.data.gender as Gender} />,
        },
        {
            field: "birthDate",
            headerName: t("pages.playerRegistrations.grid.columns.birthDate"),
            resizable: true,
            cellRenderer: (props: any) => <div>{props.data.birthDate.toLocaleDateString()}</div>,
            sortable: true,
            hide: true,
            maxWidth: 120,
        },
        {
            field: "country",
            headerName: t("pages.playerRegistrations.grid.columns.country"),
            resizable: true,
            sortable: true,
            filter: true,
            maxWidth: 150,
            hide: true,
        }, // width: 10 },
        {
            field: "city",
            headerName: t("pages.playerRegistrations.grid.columns.city"),
            resizable: true,
            sortable: true,
            filter: true,
            hide: true,
        }, // width: 20 },
        {
            field: "team",
            headerName: t("pages.playerRegistrations.grid.columns.team"),
            flex: 1,
            sortable: true,
            resizable: true,
            filter: true,
            cellRenderer: (props: any) => <div className="text-ellipsis">{props.data.team}</div>,
        },
        { field: "phoneNumber", headerName: t("pages.playerRegistrations.grid.columns.phone"), resizable: true, filter: true, hide: true }, // width: 20 },
        { field: "email", headerName: t("pages.playerRegistrations.grid.columns.email"), resizable: true, filter: true, hide: true }, // width: 20 },
        {
            field: "icePhoneNumber",
            headerName: t("pages.playerRegistrations.grid.columns.icePhoneNumber"),
            resizable: true,
            filter: true,
            hide: true,
        }, // width: 20 },
        {
            field: "registrationDate",
            headerName: t("pages.playerRegistrations.grid.columns.registrationDate"),
            maxWidth: 120,
            resizable: true,
            sortable: true,
            cellRenderer: (props: any) => <div>{props.data.registrationDate.toLocaleDateString()}</div>,
        },
        {
            field: "paymentDate",
            headerName: t("pages.playerRegistrations.grid.columns.payment"),
            sortable: true,
            resizable: true,
            maxWidth: 140,
            cellRenderer: PaymentRenderer,
        },
        {
            field: "promotedToPlayer",
            headerName: t("pages.playerRegistrations.grid.columns.promotedToPlayer"),
            sortable: true,
            filter: true,
            resizable: true,
            width: 130,
            cellRenderer: PromotedToPlayerRenderer,
        },
        {
            resizable: true,
            width: 130,
            headerName: t("pages.playerRegistrations.grid.columns.actions"),
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
            defaultColumns.map(c => ({ hide: c.hide, colId: c.field! })),
        ),
    );

    const openCreateDialog = async () => {
        const player = await Demodal.open<CreatedPlayerRegistration>(NiceModal, {
            title: t("pages.playerRegistrations.create.title"),
            component: PlayerRegistrationCreate,
            props: {
                raceId: raceId!,
            },
        });

        if (player) {
            await refetch();
        }
    };

    const onFirstDataRendered = useCallback(() => {
        gridColumnState && gridRef.current?.columnApi.applyColumnState({ state: gridColumnState });
        // gridRef.current?.api.sizeColumnsToFit();
    }, [gridColumnState]);

    const openEditDialog = async (editedPlayerRegistration?: PlayerRegistration) => {
        const playerRegistration = await Demodal.open<EditedPlayerRegistration>(NiceModal, {
            title: t("pages.playerRegistrations.edit.title"),
            component: PlayerRegistrationEdit,
            props: {
                raceId: raceId!,
                editedPlayerRegistration,
            },
        });

        if (playerRegistration) {
            await refetch();
            refreshRegistrationRow(playerRegistration!.id!.toString());
        }
    };

    return (
        <>
            <Head>
                <title>t('pages.playerRegistrations.header.title')</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader
                    title={t("pages.playerRegistrations.header.title")}
                    description={t("pages.playerRegistrations.header.description")}
                />
                <div className="mb-4 flex">
                    <Button outline onClick={openCreateDialog}>
                        <Icon size={0.8} path={mdiPlus} />
                        <span className="ml-2">{t("pages.playerRegistrations.create.button")}</span>
                    </Button>
                    <Button
                        outline
                        className="ml-2"
                        onClick={() => {
                            gridRef.current?.api.exportDataAsCsv({
                                fileName: `player-registrations-${new Date().toLocaleDateString()}.csv`,
                            });
                        }}
                    >
                        <Icon size={0.8} path={mdiExport} />
                        <span className="ml-2">{t("pages.playerRegistrations.export.button")}</span>
                    </Button>
                    <PoorColumnChooser
                        items={defaultColumns}
                        initialValue={gridColumnState.filter(c => !c.hide).map(c => c.colId)}
                        valueKey="field"
                        nameKey="headerName"
                        onChange={e => {
                            const visibleColumns = e.target.value as string[];
                            const notSelectedColumns = gridColumnState.map(c => c.colId).filter(c => !visibleColumns.includes(c));

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
                        context={{ refetch, refreshRegistrationRow }}
                        onRowDoubleClicked={e => openEditDialog(e.data)}
                        suppressCellFocus={true}
                        suppressAnimationFrame={true}
                        suppressColumnVirtualisation={true}
                        columnDefs={defaultColumns}
                        getRowId={item => item.data.id.toString()}
                        rowData={registrations}
                        onFirstDataRendered={onFirstDataRendered}
                        onGridSizeChanged={onFirstDataRendered}
                    ></AgGridReact>
                </div>
            </div>
        </>
    );
};
