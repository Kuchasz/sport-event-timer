"use client";
import type { ColDef } from "@ag-grid-community/core";
import type { AgGridReact } from "@ag-grid-community/react";
import { mdiExport, mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import type { Gender } from "@set/timer/dist/model";
import { milisecondsToTimeString } from "@set/utils/dist/datetime";
import { refreshRow } from "ag-grid";
import { Button } from "components/button";
import { GenderIcon } from "components/gender-icon";
import { PageHeader } from "components/page-header";
import { PlayerEdit } from "components/panel/player/player-edit";
import { PoorColumnChooser } from "components/poor-column-chooser";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { Demodal } from "demodal";
import { useAtom } from "jotai";
import { useLocale, useTranslations } from "next-intl";
import Head from "next/head";
import { useRef } from "react";
import { getGridColumnStateAtom } from "states/grid-states";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { Confirmation } from "../../../../../components/confirmation";
import { NiceModal } from "../../../../../components/modal";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type Player = AppRouterOutputs["player"]["players"][0];
type EditedPlayer = AppRouterInputs["player"]["edit"]["player"];

const PlayerDeleteButton = ({ player, refetch }: { player: Player; refetch: () => void }) => {
    const deletePlayerMutation = trpc.player.delete.useMutation();
    const t = useTranslations();
    const deletePlayer = async () => {
        const confirmed = await Demodal.open<boolean>(NiceModal, {
            title: t("pages.players.delete.confirmation.title"),
            component: Confirmation,
            props: {
                message: t("pages.players.delete.confirmation.text", { name: player.name, lastName: player.lastName }),
            },
        });

        if (confirmed) {
            await deletePlayerMutation.mutateAsync({ playerId: player.id });
            refetch();
        }
    };
    return (
        <span className="flex cursor-pointer items-center hover:text-red-600" onClick={deletePlayer}>
            <Icon size={0.8} path={mdiTrashCan} />
            {t("pages.players.delete.button")}
        </span>
    );
};

export const Players = () => {
    const raceId = useCurrentRaceId();
    const t = useTranslations();
    const locale = useLocale();
    const { data: players, refetch } = trpc.player.players.useQuery({ raceId: raceId });
    const gridRef = useRef<AgGridReact<Player>>(null);

    const cols: PoorDataTableColumn<Player>[] = [
        {
            field: "classificationId",
            headerName: t("pages.players.grid.columns.classification"),
            sortable: false,
        },
        {
            field: "bibNumber",
            headerName: t("pages.players.grid.columns.bibNumber"),
            // sort: "asc",
            // comparator: (valueA, valueB) => valueA - valueB,
            // filter: true,
            sortable: true,
        },
        {
            field: "name",
            headerName: t("pages.players.grid.columns.name"),
            sortable: true,
            // filter: true
        },
        {
            field: "lastName",
            headerName: t("pages.players.grid.columns.lastName"),
            sortable: true,
            // filter: true
        },
        {
            field: "gender",
            headerName: t("pages.players.grid.columns.gender"),
            sortable: true,
            // filter: true,
            // resizable: true,
            // cellStyle: { justifyContent: "center", display: "flex" },
            // width: 150,
            cellRenderer: data => <GenderIcon gender={data.gender as Gender} />,
        },
        {
            field: "startTime",
            headerName: t("pages.players.grid.columns.startTime"),
            sortable: true,
            cellRenderer: data => <div>{milisecondsToTimeString(data.startTime)}</div>,
        },
        {
            field: "birthDate",
            headerName: t("pages.players.grid.columns.birthDate"),
            sortable: true,
            hide: true,
            cellRenderer: data => <div>{data.birthDate.toLocaleDateString(locale)}</div>,
        },
        {
            field: "country",
            headerName: t("pages.players.grid.columns.country"),
            // width: 10,
            sortable: true,
            // filter: true,
            hide: true,
        },
        {
            field: "city",
            headerName: t("pages.players.grid.columns.city"),
            sortable: true,
            //filter: true,
            hide: true,
        },
        {
            field: "team",
            headerName: t("pages.players.grid.columns.team"),
            sortable: true,
            // filter: true,
            hide: true,
        },
        {
            field: "email",
            headerName: t("pages.players.grid.columns.email"),
            sortable: true,
            // filter: true,
            hide: true,
        },
        {
            field: "phoneNumber",
            headerName: t("pages.players.grid.columns.phoneNumber"),
            sortable: true,
            // filter: true,
            hide: true,
        },
        {
            field: "icePhoneNumber",
            headerName: t("pages.players.grid.columns.icePhoneNumber"),
            sortable: true,
            //  filter: true,
            hide: true,
        },
        {
            headerName: t("pages.players.grid.columns.actions"),
            field: "bibNumber",
            sortable: true,
            cellRenderer: data => <PlayerDeleteButton refetch={refetch} player={data} />,
        },
    ];

    const defaultColumns: ColDef<Player>[] = [
        // {
        //     width: 25,
        //     headerName: t("pages.players.grid.columns.index"),
        //     headerClass: "hidden",
        //     sortable: false,
        //     filter: false,
        //     valueGetter: r => r.node?.rowIndex,
        // },
        {
            field: "classificationId",
            headerName: t("pages.players.grid.columns.classification"),
        },
        {
            field: "bibNumber",
            headerName: t("pages.players.grid.columns.bibNumber"),
            sort: "asc",
            comparator: (valueA, valueB) => valueA - valueB,
            filter: true,
            sortable: true,
        },
        { field: "name", headerName: t("pages.players.grid.columns.name"), sortable: true, filter: true },
        { field: "lastName", headerName: t("pages.players.grid.columns.lastName"), sortable: true, filter: true },
        {
            field: "gender",
            headerName: t("pages.players.grid.columns.gender"),
            sortable: true,
            filter: true,
            resizable: true,
            cellStyle: { justifyContent: "center", display: "flex" },
            width: 150,
            cellRenderer: (props: { data: Player }) => <GenderIcon gender={props.data.gender as Gender} />,
        },
        {
            field: "startTime",
            headerName: t("pages.players.grid.columns.startTime"),
            sortable: true,
            cellRenderer: (props: { data: Player }) => <div>{milisecondsToTimeString(props.data.startTime)}</div>,
        },
        {
            field: "birthDate",
            headerName: t("pages.players.grid.columns.birthDate"),
            sortable: true,
            hide: true,
            cellRenderer: (props: { data: Player }) => <div>{props.data.birthDate.toLocaleDateString(locale)}</div>,
        },
        { field: "country", headerName: t("pages.players.grid.columns.country"), width: 10, sortable: true, filter: true, hide: true },
        { field: "city", headerName: t("pages.players.grid.columns.city"), sortable: true, filter: true, hide: true },
        { field: "team", headerName: t("pages.players.grid.columns.team"), sortable: true, filter: true, hide: true },
        { field: "email", headerName: t("pages.players.grid.columns.email"), sortable: true, filter: true, hide: true },
        { field: "phoneNumber", headerName: t("pages.players.grid.columns.phoneNumber"), sortable: true, filter: true, hide: true },
        { field: "icePhoneNumber", headerName: t("pages.players.grid.columns.icePhoneNumber"), sortable: true, filter: true, hide: true },
        {
            headerName: t("pages.players.grid.columns.actions"),
            cellRenderer: (props: { context: any; data: Player }) => (
                <PlayerDeleteButton refetch={props.context.refetch} player={props.data} />
            ),
        },
    ];

    const [gridColumnState, setGridColumnState] = useAtom(
        getGridColumnStateAtom(
            "players",
            defaultColumns.map(c => ({ hide: c.hide, colId: c.field! })),
        ),
    );

    // const onFirstDataRendered = useCallback(() => {
    //     gridRef.current?.columnApi.applyColumnState({ state: gridColumnState });
    //     gridRef.current?.api.sizeColumnsToFit();
    // }, [gridColumnState]);

    const openEditDialog = async (editedPlayer?: Player) => {
        const player = await Demodal.open<EditedPlayer>(NiceModal, {
            title: t("pages.players.edit.title"),
            component: PlayerEdit,
            props: {
                raceId: raceId,
                editedPlayer,
            },
        });

        if (player) {
            await refetch();
            refreshRow(gridRef, editedPlayer!.id.toString());
        }
    };

    return (
        <>
            <Head>
                <title>{t("pages.players.header.title")}</title>
            </Head>

            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.players.header.title")} description={t("pages.players.header.description")} />
                <div className="mb-4 flex">
                    <Button
                        outline
                        onClick={() => {
                            gridRef.current?.api.exportDataAsCsv({
                                fileName: `players-${new Date().toLocaleDateString(locale)}.csv`,
                            });
                        }}
                    >
                        <Icon size={0.8} path={mdiExport} />
                        <span className="ml-2">{t("pages.players.export.button")}</span>
                    </Button>
                    <PoorColumnChooser
                        items={defaultColumns}
                        initialValue={gridColumnState.filter(c => !c.hide).map(c => c.colId)}
                        valueKey="field"
                        nameKey="headerName"
                        onChange={e => {
                            const visibleColumns = e.target.value as string[];
                            const notSelectedColumns = gridColumnState.map(c => c.colId).filter(c => !visibleColumns.includes(c));

                            gridRef.current?.columnApi.setColumnsVisible(notSelectedColumns, false);
                            gridRef.current?.columnApi.setColumnsVisible(visibleColumns, true);
                            gridRef.current?.api.sizeColumnsToFit();

                            //eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                            const saveState = gridRef.current?.columnApi.getColumnState()!.map(({ colId, hide }) => ({ colId, hide }))!;

                            setGridColumnState(saveState);
                        }}
                    />
                </div>
                {players && (
                    <div className="h-full rounded-lg bg-white p-8 shadow-md">
                        <div className="ag-theme-material h-full">
                            {/* <AgGridReact<Player>
                                ref={gridRef}
                                context={{ refetch }}
                                onRowDoubleClicked={e => openEditDialog(e.data)}
                                suppressCellFocus={true}
                                suppressAnimationFrame={true}
                                columnDefs={defaultColumns}
                                getRowId={item => item.data.id.toString()}
                                rowData={players}
                                onFirstDataRendered={onFirstDataRendered}
                                onGridSizeChanged={onFirstDataRendered}
                            ></AgGridReact> */}

                            <PoorDataTable
                                data={players}
                                columns={cols}
                                getRowId={item => item.bibNumber!}
                                onRowDoubleClicked={openEditDialog}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
