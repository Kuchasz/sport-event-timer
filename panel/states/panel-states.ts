import { atomWithStorage } from 'jotai/utils'

export const selectedRaceIdAtom = atomWithStorage<number>("set.panel.selected-race-id", 0);