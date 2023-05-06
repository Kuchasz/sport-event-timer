import { atom } from "jotai/vanilla"

export function atomWithWebStorage<T>(key: string, initialValue: T, storage?: Storage) {
    if (!storage)
        return atom(initialValue);

    const valueString = storage.getItem(key);

    const baseAtom = atom(valueString ? JSON.parse(valueString) as T : initialValue);

    return atom(
        (get) => get(baseAtom),
        (_, set, nextValue: T) => {
            set(baseAtom, nextValue)
            storage.setItem(key, JSON.stringify(nextValue))
        }
    )
}