import { useAtom } from "jotai";
import { getGridColumnVisibilityStateAtom } from "states/grid-states";
import { PoorColumnChooser } from "./poor-column-chooser";
import { PoorInput } from "./poor-input";
import { useState } from "react";
import fuzzysort from "fuzzysort";
import { useTranslations } from "next-intl";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";

export type PoorDataTableColumn<T> = {
    field: keyof T;
    headerName: string;
    sortable: boolean;
    cellRenderer?: React.FC<T>;
    hide?: boolean;
};

type PoorDataTableProps<T> = {
    gridName: string;
    columns: PoorDataTableColumn<T>[];
    data: T[];
    getRowId: (row: T) => string | number;
    onRowDoubleClicked: (row: T) => void;
    searchFields?: (keyof T)[];
    searchPlaceholder?: string;
};

export const PoorDataTable = <T,>(props: PoorDataTableProps<T>) => {
    const { gridName, data, columns, getRowId, onRowDoubleClicked, searchFields, searchPlaceholder } = props;
    const t = useTranslations();

    const [gridColumnVisibilityState, setGridColumnVisibilityState] = useAtom(
        getGridColumnVisibilityStateAtom(
            gridName,
            columns.map(c => ({ hide: c.hide, colId: c.field as string })),
        ),
    );

    const rowsContainer = React.useRef<HTMLDivElement>(null);

    const [searchQuery, setSearchQuery] = useState("");

    const visibleColumnKeys = new Set<string | number | symbol>(gridColumnVisibilityState.filter(s => !s.hide).map(s => s.colId));

    const visibleColumns = columns.filter(c => visibleColumnKeys.has(c.field));

    const usableSearchFields = searchFields?.filter(sf => visibleColumnKeys.has(sf));

    const useSearch = !!usableSearchFields?.length;

    if (useSearch) data.forEach(d => ((d as T & { __searchField: string }).__searchField = usableSearchFields?.map(f => d[f]).join("|")));

    const filteredData = fuzzysort.go(searchQuery, data, { all: true, key: "__searchField" });

    const fileredDataMap = new Map(filteredData.map((d, index) => [index, d.obj]));

    const itemSize = 52;

    const rowVirtualizer = useVirtualizer({
        count: filteredData.length,
        getScrollElement: () => rowsContainer.current,
        estimateSize: () => itemSize,
    });

    return (
        <div className="flex h-full flex-col">
            <div className="mb-4 flex justify-between">
                {searchFields?.length && (
                    <PoorInput
                        className="flex-grow"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder={searchPlaceholder ?? t("shared.dataTable.search.placeholder")}
                    />
                )}
                <div className="flex-grow"></div>
                <PoorColumnChooser
                    items={columns}
                    initialValue={gridColumnVisibilityState.filter(c => !c.hide).map(c => c.colId)}
                    valueKey="field"
                    nameKey="headerName"
                    onChange={e => {
                        const visibleColumns = e.target.value as string[];

                        const saveState = gridColumnVisibilityState.map(v => ({ ...v, hide: !visibleColumns.includes(v.colId) }));

                        setGridColumnVisibilityState(saveState);
                    }}
                />
            </div>

            <div ref={rowsContainer} className="basis-auto overflow-x-auto overflow-y-auto rounded-md border" style={{ height: "300px" }}>
                <div
                    className="relative grid w-full"
                    style={{
                        gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(auto, 1fr))`,
                        gridAutoRows: `${itemSize}px`,
                        height: `${rowVirtualizer.getTotalSize() + itemSize}px`,
                    }}
                >
                    <div className="contents text-xs font-bold">
                        {visibleColumns.map(c => (
                            <div className="sticky top-0 whitespace-nowrap border-b bg-white px-4 py-4" key={c.headerName}>
                                {c.headerName}
                            </div>
                        ))}
                    </div>
                    <div className="contents">
                        {rowVirtualizer.getVirtualItems().map(vi => (
                            <div
                                onDoubleClick={() => onRowDoubleClicked(fileredDataMap.get(vi.index)!)}
                                className="group contents text-sm"
                                key={getRowId(fileredDataMap.get(vi.index)!)}
                            >
                                {visibleColumns.map(c => (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            // left: 0,
                                            // width: "100%",
                                            height: `${itemSize}px`,
                                            transform: `translateY(${vi.start + itemSize}px)`,
                                        }}
                                        className="flex items-center px-4 py-3 group-hover:bg-gray-50"
                                        key={c.headerName}
                                    >
                                        {c.cellRenderer ? (
                                            <span className="whitespace-nowrap">{c.cellRenderer(fileredDataMap.get(vi.index)!)}</span>
                                        ) : (
                                            <div className="whitespace-nowrap">{fileredDataMap.get(vi.index)![c.field] as any}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
