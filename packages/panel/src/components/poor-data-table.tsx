"use client";
import { mdiArrowDown, mdiArrowUp, mdiChevronLeft, mdiChevronRight, mdiMagnify, mdiUnfoldMoreHorizontal } from "@mdi/js";
import Icon from "@mdi/react";
import { clamp } from "@set/utils/dist/number";
import classNames from "classnames";
import fuzzysort from "fuzzysort";
import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { getGridColumnVisibilityStateAtom } from "src/states/grid-states";
import { PoorColumnChooser } from "./poor-column-chooser";
import { PoorInput } from "./poor-input";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { naturalSort } from "@set/utils/dist/array";

export type PoorDataTableColumn<T> = {
    [TField in keyof T]: {
        field: TField;
        headerName: string;
        sortable?: T[TField] extends Date ? false : boolean;
        cellRenderer?: React.FC<T>;
        hide?: boolean;
    };
}[keyof T];

type PoorDataTableProps<T> = {
    gridName: string;
    columns: PoorDataTableColumn<T>[];
    data: T[];
    getRowId: (row: T) => string | number;
    onRowDoubleClicked?: (row: T) => void;
    searchFields?: (keyof T)[];
    searchPlaceholder?: string;
    hideColumnsChooser?: boolean;
    hidePaging?: boolean;
    getRowStyle?: (row: T) => string;
};

type SortState<T> = { field: keyof T; order: "desc" | "asc" };

interface Result {
    readonly score: number;
    readonly target: string;
}

interface KeysResult<T> extends ReadonlyArray<Result> {
    readonly score: number;
    readonly obj: T;
}

export const PoorDataTable = <T,>(props: PoorDataTableProps<T>) => {
    const { gridName, data, columns, getRowId, getRowStyle, onRowDoubleClicked, searchFields, searchPlaceholder } = props;
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

    useEffect(() => {
        changePage(0);
    }, [searchQuery]);

    const rowsPerPage = 25;

    const filteredData = usableSearchFields?.length
        ? (fuzzysort.go(searchQuery, data, { all: true, keys: usableSearchFields as string[] }) as readonly KeysResult<T>[])
        : (data.map(d => ({ obj: d, field: "", score: 0 })) as unknown as readonly KeysResult<T>[]);

    const sortedFilteredData = sortColumn
        ? naturalSort([...filteredData], sortColumn.order, d => String(d.obj[sortColumn.field]))
        : filteredData;

    const pagesData = !props.hidePaging
        ? sortedFilteredData.slice(
              currentPage * rowsPerPage,
              clamp(currentPage * rowsPerPage + rowsPerPage, currentPage * rowsPerPage, sortedFilteredData.length),
          )
        : sortedFilteredData;

    const numberOfPages = Math.ceil(sortedFilteredData.length / rowsPerPage);
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
            <div className="mb-4 flex">
                {searchFields?.length && (
                    <div className="flex-grow">
                        <PoorInput
                            className="flex-grow"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={searchPlaceholder ?? t("shared.dataTable.search.placeholder")}
                        />
                    </div>
                )}
                <div className="flex-grow"></div>
                {!props.hideColumnsChooser && (
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
                )}
            </div>
            <ScrollArea className="basis-auto rounded-md border">
                <div
                    className="relative grid"
                    style={{
                        gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(auto, 1fr))`,
                        gridAutoRows: "auto",
                    }}>
                    <div className="contents text-xs font-bold">
                        {visibleColumns.map(c => (
                            <div className="sticky top-0 z-[9] flex border-b bg-white" key={c.headerName}>
                                {c.sortable ? (
                                    <div
                                        onClick={() => handleSortClick(c, sortColumn)}
                                        className="m-2 flex cursor-pointer select-none items-center justify-start whitespace-nowrap rounded-md bg-white px-2 py-1 transition-colors hover:bg-gray-100">
                                        <span className="mr-2">{c.headerName}</span>
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
                                    <div className="m-2 flex cursor-default select-none items-center justify-start whitespace-nowrap rounded-md bg-white px-2 py-1 transition-colors">
                                        <span>{c.headerName}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="contents">
                        {pagesData.length ? (
                            pagesData.map(d => (
                                <div
                                    onDoubleClick={() => onRowDoubleClicked && onRowDoubleClicked(d.obj)}
                                    className="group contents text-sm"
                                    key={getRowId(d.obj)}>
                                    {visibleColumns.map(c => (
                                        <div
                                            className={classNames(
                                                "flex items-center border-b px-4 py-2",
                                                getRowStyle ? getRowStyle(d.obj) : "",
                                            )}
                                            key={c.headerName}>
                                            {c.cellRenderer ? (
                                                <span className="whitespace-nowrap">{c.cellRenderer(d.obj)}</span>
                                            ) : (
                                                <div className="whitespace-nowrap">
                                                    {searchQuery &&
                                                    usableSearchFields?.includes(c.field) &&
                                                    d[usableSearchFields.indexOf(c.field)]
                                                        ? fuzzysort.highlight(d[usableSearchFields.indexOf(c.field)], (m, i) => (
                                                              <mark key={i}>{m}</mark>
                                                          ))
                                                        : (d.obj[c.field] as any)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div
                                className="flex items-center justify-center p-8 text-sm"
                                style={{ gridColumn: `1 / span ${visibleColumns.length}` }}>
                                <Icon className="mx-2" path={mdiMagnify} size={1}></Icon>
                                <span>{t("shared.dataTable.noRowsToShow")}</span>
                            </div>
                        )}
                    </div>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {!props.hidePaging && (
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
                            onClick={() => changePage(currentPage - 1)}>
                            <Icon path={mdiChevronLeft} size={1}></Icon>
                        </button>
                        <button
                            disabled={isLastPage}
                            className={classNames(
                                "relative flex items-center justify-center rounded-md border border-gray-300 p-1 text-sm font-medium shadow-sm transition-all",
                                { ["opacity-50"]: isLastPage },
                            )}
                            onClick={() => changePage(currentPage + 1)}>
                            <Icon path={mdiChevronRight} size={1}></Icon>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
