import { ColDef } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { useCallback, useRef } from "react";
import { AppRouterOutputs } from "trpc";
import { trpc } from "../../../connection";

type Account = AppRouterOutputs["account"]["accounts"][0];

const defaultColumns: ColDef<Account>[] = [{ field: "email", headerName: "Email", sortable: true, filter: true }];

const Accounts = () => {
    const { data: accounts } = trpc.account.accounts.useQuery(undefined, { initialData: [] });
    const gridRef = useRef<AgGridReact<Account>>(null);

    const onFirstDataRendered = useCallback(() => {
        gridRef.current?.api.sizeColumnsToFit();
    }, []);

    return (
        <>
            <div className="ag-theme-material border-1 flex flex-col h-full border-gray-600 border-solid">
                <AgGridReact<Account>
                    ref={gridRef}
                    suppressCellFocus={true}
                    suppressAnimationFrame={true}
                    columnDefs={defaultColumns}
                    rowData={accounts}
                    onFirstDataRendered={onFirstDataRendered}
                    onGridSizeChanged={onFirstDataRendered}
                ></AgGridReact>
            </div>
        </>
    );
};

export default Accounts;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
