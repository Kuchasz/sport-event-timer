import { useLocale } from "next-intl";

const getShortcut = (name: string) => name.slice(0, 2).toUpperCase();

export const FullRaceIcon = ({ r }: { r: { name: string; date: Date } }) => {
    const locale = useLocale();
    return (
        <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 bg-gray-800 text-white">
            <div className="text-6xl">{getShortcut(r.name)}</div>
            <div className="text-xs font-semibold text-gray-400">{r.date.toLocaleDateString(locale)}</div>
        </div>
    );
};

export const ConciseRaceIcon = ({ r }: { r: { name: string; date: Date } }) => {
    return (
        <div className="mx-3 flex h-12 items-center">
            <div className="flex aspect-square h-full flex-col items-center justify-center rounded-md bg-gray-800 text-white">
                <div className="text-xl">{getShortcut(r.name)}</div>
            </div>
            <div className="ml-2 text-xs font-semibold">{r.name}</div>
        </div>
    );
};
