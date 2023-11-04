import { useState } from "react";

export type PoorDataTableColumn<T> = {
    field: keyof T;
    headerName: string;
    sortable: boolean;
    cellRenderer?: React.FC<T>;
    hide?: boolean;
};

type PoorDataTableProps<T> = {
    columns: PoorDataTableColumn<T>[];
    data: T[];
    getRowId: (row: T) => string | number;
    onRowDoubleClicked: (row: T) => void;
};

export const PoorDataTable = <T,>(props: PoorDataTableProps<T>) => {
    const { data, columns, getRowId, onRowDoubleClicked } = props;

    const [visibleColumnKeys, _setVisibleColumns] = useState<Set<keyof T>>(new Set(columns.filter(c => !c.hide).map(c => c.field)));

    const visibleColumns = columns.filter(c => visibleColumnKeys.has(c.field));

    return (
        <div
            className="grid h-full overflow-x-auto overflow-y-auto"
            style={{ gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(auto, 1fr))` }}
        >
            <div className="contents text-xs font-bold">
                {visibleColumns.map(c => (
                    <div className="sticky top-0 whitespace-nowrap border-b bg-white py-4 pl-4" key={c.headerName}>
                        {c.headerName}
                    </div>
                ))}
            </div>
            <div className="contents">
                {data.map(d => (
                    <div onDoubleClick={() => onRowDoubleClicked(d)} className="group contents text-sm" key={getRowId(d)}>
                        {visibleColumns.map(c => (
                            <div className="flex items-center py-3 pl-4 group-hover:bg-gray-50" key={c.headerName}>
                                {c.cellRenderer ? c.cellRenderer(d) : <div className="whitespace-nowrap">{d[c.field] as any}</div>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
