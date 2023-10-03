import Icon from "@mdi/react";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { mdiArrowUpDown, mdiCheck, mdiChevronDown } from "@mdi/js";

export const PoorSelect = <T, TNameKey extends keyof T, TValueKey extends keyof T>({
    items,
    initialValue,
    nameKey,
    valueKey,
    onChange,
    placeholder,
}: {
    initialValue?: T[TValueKey] | null;
    items: T[];
    nameKey: TNameKey;
    valueKey: TValueKey;
    onChange: (event: { target: { value: T[TValueKey] } }) => void;
    placeholder?: string;
}) => {
    const [selected, setSelected] = useState(initialValue);

    const desiredItem = selected ? items.find(i => String(i[valueKey]) === String(selected))! : undefined; //({ [valueKey]: -1, [nameKey]: placeholder || "Select value" } as unknown as T);

    return (
        <Listbox
            value={selected}
            onChange={(e: T[TValueKey]) => {
                setSelected(e);
                const desiredItem = items.find(i => String(i[valueKey]) === String(e))!;
                onChange({ target: { value: desiredItem[valueKey] } });
            }}
        >
            <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border-gray-300 border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    {desiredItem ? (
                        <span className="block truncate">{String(desiredItem[nameKey])}</span>
                    ) : (
                        <span className="text-gray-400 block truncate">{placeholder}</span>
                    )}
                    <span className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-4">
                        {/* <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                        <Icon path={mdiArrowUpDown} size={0.7} />
                    </span>
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {items.map((item, personIdx) => (
                            <Listbox.Option
                                key={personIdx}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                                    }`
                                }
                                value={item[valueKey]}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                            {String(item[nameKey])}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                                <Icon path={mdiCheck} size={1} />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};

export const PoorSelect2 = <T, TNameKey extends keyof T, TValueKey extends keyof T>({
    items,
    initialValue,
    nameKey,
    valueKey,
    onChange,
    placeholder,
}: {
    initialValue?: T[TValueKey];
    items: T[];
    nameKey: TNameKey;
    valueKey: TValueKey;
    onChange: (event: { target: { value: T[TValueKey] } }) => void;
    placeholder?: string;
}) => {
    const [selected, setSelected] = useState(initialValue);

    const desiredItem =
        selected && items?.length > 0
            ? items.find(i => String(i[valueKey]) === String(selected))!
            : initialValue && items?.length > 0
            ? items.find(i => String(i[valueKey]) === String(initialValue))!
            : ({ [valueKey]: -1, [nameKey]: placeholder || "Select value" } as unknown as T);

    return (
        <div className="min-w-[14rem]">
            <Listbox
                value={selected}
                onChange={(e: T[TValueKey]) => {
                    setSelected(e);
                    const desiredItem = items.find(i => String(i[valueKey]) === String(e))!;
                    onChange({ target: { value: desiredItem[valueKey] } });
                }}
            >
                <div className="relative w-full flex-shrink px-2">
                    <Listbox.Button className="relative w-full rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">{String(desiredItem[nameKey])}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            {/* <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                            <Icon className="text-gray-400" path={mdiChevronDown} size={1} />
                        </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {items.map((item, personIdx) => (
                                <Listbox.Option
                                    key={personIdx}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                            active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                                        }`
                                    }
                                    value={item[valueKey]}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                                                {String(item[nameKey])}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                    {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                                                    <Icon path={mdiCheck} size={1} />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
};
