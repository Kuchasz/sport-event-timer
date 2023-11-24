"use client";
import type { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { PageHeader } from "components/page-header";
import { useCallback, useRef } from "react";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "../../../../../../trpc-core";

type Account = AppRouterOutputs["user"]["accounts"][0];

const defaultColumns: ColDef<Account>[] = [{ field: "email", headerName: "Email", sortable: true, filter: true }];

export const Accounts = () => {
    const { data: accounts } = trpc.user.accounts.useQuery(undefined, { initialData: [] });
    const gridRef = useRef<AgGridReact<Account>>(null);

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.api.sizeColumnsToFit();
    }, []);

    return (
        <>
            <PageHeader title="Accounts" description="Manage accounts having access to the races" />
            <div className="ag-theme-material border-1 flex h-full flex-col border-solid border-gray-600">
                <AgGridReact<Account>
                    ref={gridRef}
                    suppressCellFocus={true}
                    suppressAnimationFrame={true}
                    columnDefs={defaultColumns}
                    getRowId={item => item.data.email!}
                    rowData={accounts}
                    onFirstDataRendered={onFirstDataRendered}
                    onGridSizeChanged={onFirstDataRendered}
                ></AgGridReact>
            </div>
        </>
    );
};
