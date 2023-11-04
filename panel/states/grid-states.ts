import type { ColumnState } from "@ag-grid-community/core";
import { atomWithWebStorage } from "jotai-utils";

type HiddenColumnState = Pick<ColumnState, "colId" | "hide">;
const gridColumnStateAtoms = new Map<string, ReturnType<typeof atomWithWebStorage<HiddenColumnState[]>>>();

type HiddenColumn = { hide?: boolean; colId: string };
const gridColumnVisibilityStateAtoms = new Map<string, ReturnType<typeof atomWithWebStorage<HiddenColumn[]>>>();

export const getGridColumnStateAtom = (gridName: string, defaultGridSettings: HiddenColumnState[]) => {
    if (gridColumnStateAtoms.has(gridName)) {
        return gridColumnStateAtoms.get(gridName)!;
    }

    const newAtom = atomWithWebStorage<HiddenColumnState[]>(
        `set.panel.grid-column-state.${gridName}`,
        defaultGridSettings,
        typeof window !== "undefined" ? localStorage : undefined,
    );

    gridColumnStateAtoms.set(gridName, newAtom);

    return newAtom;
};

export const getGridColumnVisibilityStateAtom = (gridName: string, defaultColumnState: HiddenColumn[]) => {
    if (gridColumnVisibilityStateAtoms.has(gridName)) {
        return gridColumnVisibilityStateAtoms.get(gridName)!;
    }

    const newAtom = atomWithWebStorage(
        `set.panel.grid-column-state.${gridName}`,
        defaultColumnState,
        typeof window !== "undefined" ? localStorage : undefined,
    );

    gridColumnVisibilityStateAtoms.set(gridName, newAtom);

    return newAtom;
};
