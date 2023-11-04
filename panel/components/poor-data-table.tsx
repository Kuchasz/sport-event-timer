import { useAtom } from "jotai";
import { getGridColumnVisibilityStateAtom } from "states/grid-states";
import { PoorColumnChooser } from "./poor-column-chooser";

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

    const [gridColumnVisibilityState, setGridColumnVisibilityState] = useAtom(
        getGridColumnVisibilityStateAtom(
            "players",
            columns.map(c => ({ hide: c.hide, colId: c.field as string })),
        ),
    );

    const visibleColumnKeys = new Set<string | number | symbol>(gridColumnVisibilityState.filter(s => !s.hide).map(s => s.colId));

    // const [visibleColumnKeys, _setVisibleColumns] = useState<Set<keyof T>>(new Set(columns.filter(c => !c.hide).map(c => c.field)));

    const visibleColumns = columns.filter(c => visibleColumnKeys.has(c.field));

    return (
        <div className="h-full">
            <PoorColumnChooser
                items={columns}
                initialValue={gridColumnVisibilityState.filter(c => !c.hide).map(c => c.colId)}
                valueKey="field"
                nameKey="headerName"
                onChange={e => {
                    const visibleColumns = e.target.value as string[];
                    // const notSelectedColumns = gridColumnVisibilityState.map(c => c.colId).filter(c => !visibleColumns.includes(c));

                    // gridRef.current?.columnApi.setColumnsVisible(notSelectedColumns, false);
                    // gridRef.current?.columnApi.setColumnsVisible(visibleColumns, true);
                    // gridRef.current?.api.sizeColumnsToFit();

                    //eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                    // const saveState = gridRef.current?.columnApi.getColumnState()!.map(({ colId, hide }) => ({ colId, hide }))!;

                    const saveState = gridColumnVisibilityState.map(v => ({ ...v, hide: !visibleColumns.includes(v.colId) }));

                    setGridColumnVisibilityState(saveState);
                }}
            />

            <div
                className="grid overflow-x-auto overflow-y-auto"
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
        </div>
    );
};
