import { atomWithWebStorage } from "src/jotai-utils";

type HiddenColumn = { hide?: boolean; colId: string };
const gridColumnVisibilityStateAtoms = new Map<string, ReturnType<typeof atomWithWebStorage<HiddenColumn[]>>>();

export const getGridColumnVisibilityStateAtom = (gridName: string, defaultColumnState: HiddenColumn[]) => {
    if (gridColumnVisibilityStateAtoms.has(gridName)) {
        return gridColumnVisibilityStateAtoms.get(gridName)!;
    }

    const newAtom = atomWithWebStorage(
        `set.panel.grid-column-state.${gridName}`,
        defaultColumnState,
        undefined,
        // typeof window !== "undefined" ? localStorage : undefined,
    );

    gridColumnVisibilityStateAtoms.set(gridName, newAtom);

    return newAtom;
};
