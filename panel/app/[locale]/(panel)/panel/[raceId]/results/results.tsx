"use client";
import { formatTimeWithMilliSec, formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";
import { AppRouterOutputs } from "trpc";
import { trpc } from "../../../../../../trpc-core";

import { useCurrentRaceId } from "../../../../../../hooks";
import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useCallback, useRef } from "react";
import Head from "next/head";
import { PageHeader } from "components/page-header";

type Result = AppRouterOutputs["result"]["results"][0];

const defaultColumns: ColDef<Result>[] = [
    { field: "bibNumber", sortable: true, filter: true, headerName: "Bib" },
    {
        field: "player.name",
        sortable: true,
        filter: true,
        headerName: "Name",
        cellRenderer: (p: { data: Result }) => <span>{p.data.name}</span>,
    },
    {
        field: "player.lastName",
        sortable: true,
        filter: true,
        headerName: "Last Name",
        cellRenderer: (p: { data: Result }) => <span>{p.data.lastName}</span>,
    },
    {
        field: "start",
        headerName: "Start",
        sortable: true,
        cellRenderer: (p: { data: Result }) => <span>{formatTimeWithMilliSec(p.data.start)}</span>,
    },
    {
        field: "finish",
        headerName: "Finish",
        sortable: true,
        cellRenderer: (p: { data: Result }) => <span>{formatTimeWithMilliSec(p.data.finish)}</span>,
    },
    {
        field: "result",
        headerName: "Result",
        sort: "asc",
        sortable: true,
        cellRenderer: (p: { data: Result }) => (
            <span className="flex uppercase flex-col items-end font-mono">
                {p.data.invalidState ? p.data.invalidState : formatTimeWithMilliSecUTC(p.data.result)}
            </span>
        ),
    },
];

export const Results = () => {
    const raceId = useCurrentRaceId();
    const { data: results, refetch } = trpc.result.results.useQuery({ raceId: raceId! });
    const gridRef = useRef<AgGridReact<Result>>(null);
    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.api.sizeColumnsToFit();
    }, []);

    return (
        <>
            <Head>
                <title>Race results</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <PageHeader title="Race Results" description="Results measured by the stopwatch, each may be overriden" />
                {/* <div className="mb-4 inline-flex">
                    <Button onClick={() => {}}>
                        <Icon size={1} path={mdiPlus} />
                    </Button>
                </div> */}
                {results && (
                    <div className="ag-theme-material h-full">
                        <AgGridReact<Result>
                            ref={gridRef}
                            context={{ refetch }}
                            suppressCellFocus={true}
                            suppressAnimationFrame={true}
                            columnDefs={defaultColumns}
                            rowData={results}
                            onFirstDataRendered={onFirstDataRendered}
                            onGridSizeChanged={onFirstDataRendered}
                        ></AgGridReact>
                    </div>
                )}
            </div>
        </>
    );
};