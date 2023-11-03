export type PoorDataTableColumn<T> = {
    field: keyof T;
    headerName: string;
    sortable: boolean;
    cellRenderer: React.FC<T>;
};

type PoorDataTableProps<T> = {
    columns: PoorDataTableColumn<T>[];
    data: T[];
    getRowId: (row: T) => string | number;
};

export const PoorDataTable = <T,>(props: PoorDataTableProps<T>) => {
    const { data, columns, getRowId } = props;

    return (
        <div className="grid h-96 overflow-y-scroll" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
            <div className="contents text-xs font-bold">
                {columns.map(c => (
                    <div className="sticky top-0 border-b bg-white py-4 pl-4" key={c.headerName}>
                        {c.headerName}
                    </div>
                ))}
            </div>
            <div className="contents">
                {data.map(d => (
                    <div className="group contents text-sm" key={getRowId(d)}>
                        {columns.map(c => (
                            <div className="py-3 pl-4 group-hover:bg-gray-50" key={c.headerName}>
                                {c.cellRenderer(d)}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
