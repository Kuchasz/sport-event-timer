export type PoorDataTableColumn<T> = {
    field: keyof T;
    headerName: string;
    sortable: boolean;
    cellRenderer?: React.FC<T>;
};

type PoorDataTableProps<T> = {
    columns: PoorDataTableColumn<T>[];
    data: T[];
    getRowId: (row: T) => string | number;
    onRowDoubleClicked: (row: T) => void;
};

export const PoorDataTable = <T,>(props: PoorDataTableProps<T>) => {
    const { data, columns, getRowId, onRowDoubleClicked } = props;

    return (
        <div
            className="grid h-96 overflow-x-auto overflow-y-auto"
            style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(auto, 1fr))` }}
        >
            <div className="contents text-xs font-bold">
                {columns.map(c => (
                    <div className="sticky top-0 whitespace-nowrap border-b bg-white py-4 pl-4" key={c.headerName}>
                        {c.headerName}
                    </div>
                ))}
            </div>
            <div className="contents">
                {data.map(d => (
                    <div onDoubleClick={() => onRowDoubleClicked(d)} className="group contents text-sm" key={getRowId(d)}>
                        {columns.map(c => (
                            <div className="py-3 pl-4 group-hover:bg-gray-50" key={c.headerName}>
                                {c.cellRenderer ? c.cellRenderer(d) : <div className="whitespace-nowrap">{d[c.field] as any}</div>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
