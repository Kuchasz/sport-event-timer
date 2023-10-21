import { AgGridReact } from "@ag-grid-community/react";
import { RefObject } from "react";

export const refreshRow = <T>(gridRef: RefObject<AgGridReact<T>>, itemId: string) => {
    const rowNode = gridRef.current?.api.getRowNode(itemId)!;
    gridRef.current?.api.redrawRows({
        rowNodes: [rowNode],
    });
};
