import { atomWithStorage, createJSONStorage } from 'jotai/utils'

export const selectedRaceIdAtom = atomWithStorage("set.panel.selected-race-id", 0, {
    ...createJSONStorage(() => localStorage)
});