import { useAtom } from "jotai";
import { getGridColumnVisibilityStateAtom } from "states/grid-states";
import { PoorColumnChooser } from "./poor-column-chooser";
import { PoorInput } from "./poor-input";
import { useEffect, useState } from "react";
import fuzzysort from "fuzzysort";
import { useTranslations } from "next-intl";
import React from "react";
import { mdiArrowDown, mdiArrowUp, mdiChevronLeft, mdiChevronRight, mdiUnfoldMoreHorizontal } from "@mdi/js";
import Icon from "@mdi/react";
import { clamp } from "@set/utils/dist/number";
import classNames from "classnames";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { sort } from "@set/utils/dist/array";

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

type SortState<T> = { field: keyof T; order: "desc" | "asc" };

export const PoorDataTable = <T,>(props: PoorDataTableProps<T>) => {
    const { gridName, data, columns, getRowId, onRowDoubleClicked, searchFields, searchPlaceholder } = props;
    const t = useTranslations();

    const [gridColumnVisibilityState, setGridColumnVisibilityState] = useAtom(
        getGridColumnVisibilityStateAtom(
            gridName,
            columns.map(c => ({ hide: c.hide, colId: c.field as string })),
        ),
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, changePage] = useState(0);
    const [sortColumn, sortOverColumn] = useState<SortState<T> | null>(null);

    const visibleColumnKeys = new Set<string | number | symbol>(gridColumnVisibilityState.filter(s => !s.hide).map(s => s.colId));

    const visibleColumns = columns.filter(c => visibleColumnKeys.has(c.field));

    const usableSearchFields = searchFields?.filter(sf => visibleColumnKeys.has(sf));

    const useSearch = !!usableSearchFields?.length;

    useEffect(() => {
        changePage(0);
    }, [searchQuery]);

    if (useSearch) data.forEach(d => ((d as T & { __searchField: string }).__searchField = usableSearchFields?.map(f => d[f]).join("|")));

    const rowsPerPage = 25;

    const filteredData = fuzzysort.go(searchQuery, data, { all: true, key: "__searchField" });

    // const sortedFilteredData = sortColumn ? sort(filteredData) : filteredData;

    const pagesData = filteredData.slice(
        currentPage * rowsPerPage,
        clamp(currentPage * rowsPerPage + rowsPerPage, currentPage * rowsPerPage, filteredData.length),
    );

    const numberOfPages = Math.ceil(filteredData.length / rowsPerPage);
    const isFirstPage = currentPage + 1 <= 1;
    const isLastPage = currentPage + 1 >= numberOfPages;

    function handleSortClick(c: PoorDataTableColumn<T>, sortColumn: SortState<T> | null): void {
        if (sortColumn?.field === c.field)
            if (sortColumn.order === "asc") sortOverColumn({ order: "desc", field: c.field });
            else sortOverColumn(null);
        else sortOverColumn({ order: "asc", field: c.field });
    }

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

            {/* <div
                                    className={classNames(
                                        "m-2 flex cursor-default items-center justify-start whitespace-nowrap rounded-md bg-white p-2 transition-colors",
                                        c.sortable && "cursor-pointer hover:bg-gray-100",
                                    )}
                                >
                                    <span>{c.headerName}</span>
                                    {c.sortable && c.field === sortColumn?.field ? (
                                        sortColumn.order === "asc" ? (
                                            <Icon className="text-gray-600" size={0.6} path={mdiArrowUp} />
                                        ) : (
                                            <Icon className="text-gray-600" size={0.6} path={mdiArrowDown} />
                                        )
                                    ) : (
                                        <Icon className="text-gray-400" size={0.6} path={mdiUnfoldMoreHorizontal} />
                                    )}
                                </div> */}

            <ScrollArea className=" basis-auto rounded-md border">
                <div
                    className="relative grid"
                    style={{
                        gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(auto, 1fr))`,
                        gridAutoRows: "auto",
                    }}
                >
                    <div className="contents text-xs font-bold">
                        {visibleColumns.map(c => (
                            <div className="sticky top-0 flex border-b bg-white" key={c.headerName}>
                                {c.sortable ? (
                                    <div
                                        onClick={() => handleSortClick(c, sortColumn)}
                                        className="m-2 flex cursor-pointer items-center justify-start whitespace-nowrap rounded-md bg-white p-2 transition-colors hover:bg-gray-100"
                                    >
                                        <span>{c.headerName}</span>
                                        {c.field === sortColumn?.field ? (
                                            sortColumn.order === "asc" ? (
                                                <Icon className="text-gray-600" size={0.6} path={mdiArrowUp} />
                                            ) : (
                                                <Icon className="text-gray-600" size={0.6} path={mdiArrowDown} />
                                            )
                                        ) : (
                                            <Icon className="text-gray-400" size={0.6} path={mdiUnfoldMoreHorizontal} />
                                        )}
                                    </div>
                                ) : (
                                    <div className="m-2 flex cursor-default items-center justify-start whitespace-nowrap rounded-md bg-white p-2 transition-colors">
                                        <span>{c.headerName}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="contents">
                        {pagesData.map(d => (
                            <div onDoubleClick={() => onRowDoubleClicked(d.obj)} className="group contents text-sm" key={getRowId(d.obj)}>
                                {visibleColumns.map(c => (
                                    <div className="flex items-center px-4 py-3 group-hover:bg-gray-50" key={c.headerName}>
                                        {c.cellRenderer ? (
                                            <span className="whitespace-nowrap">{c.cellRenderer(d.obj)}</span>
                                        ) : (
                                            <div className="whitespace-nowrap">{d.obj[c.field] as any}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div className="flex items-center gap-6 py-4 text-sm">
                <div className="flex-grow"></div>
                <div>
                    <span className="font-semibold">
                        {t("shared.dataTable.paging.rowsPerPage")} {rowsPerPage}
                    </span>
                </div>
                <div className="font-semibold">
                    {t("shared.dataTable.paging.currentPage", { currentPage: currentPage + 1, totalPages: numberOfPages })}
                </div>
                <div className="flex gap-2">
                    <button
                        disabled={isFirstPage}
                        className={classNames(
                            "relative flex items-center justify-center rounded-md border border-gray-300 p-1 text-sm font-medium shadow-sm transition-all",
                            { ["opacity-50"]: isFirstPage },
                        )}
                        onClick={() => changePage(currentPage - 1)}
                    >
                        <Icon path={mdiChevronLeft} size={1}></Icon>
                    </button>
                    <button
                        disabled={isLastPage}
                        className={classNames(
                            "relative flex items-center justify-center rounded-md border border-gray-300 p-1 text-sm font-medium shadow-sm transition-all",
                            { ["opacity-50"]: isLastPage },
                        )}
                        onClick={() => changePage(currentPage + 1)}
                    >
                        <Icon path={mdiChevronRight} size={1}></Icon>
                    </button>
                </div>
            </div>
        </div>
    );
};
