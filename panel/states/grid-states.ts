import { ColumnState } from "@ag-grid-community/core";
import { atomWithWebStorage } from "jotai-utils";

type HiddenColumnState = Pick<ColumnState, 'colId' | 'hide'>;
const gridColumnStateAtoms = new Map<string, ReturnType<typeof atomWithWebStorage<HiddenColumnState[]>>>();

export const getGridColumnStateAtom = (gridName: string, defaultGridSettings: HiddenColumnState[]) => {
    if (gridColumnStateAtoms.has(gridName)) {
        return gridColumnStateAtoms.get(gridName)!;
    }

    const newAtom = atomWithWebStorage<HiddenColumnState[]>(`set.grid-column-state.${gridName}`, defaultGridSettings, typeof window !== 'undefined' ? localStorage : undefined);

    gridColumnStateAtoms.set(gridName, newAtom);

    return newAtom;
}