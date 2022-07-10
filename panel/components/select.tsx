import Icon from "@mdi/react";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { mdiArrowUpDown, mdiCheck } from "@mdi/js";

export const Select = <T, TKey extends keyof T>({
    items,
    initialValue,
    nameKey,
    onChange
}: {
    items: T[];
    initialValue: T;
    nameKey: TKey;
    onChange: (value: T) => void;
}) => {
    const [selected, setSelected] = useState(initialValue);

    return (
        <Listbox
            value={selected}
            onChange={e => {
                setSelected(e);
                onChange(e);
            }}
        >
            <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="block truncate">{String(selected[nameKey])}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        {/* <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                        <Icon className="text-gray-400" path={mdiArrowUpDown} size={0.7} />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {items.map((item, personIdx) => (
                            <Listbox.Option
                                key={personIdx}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                                    }`
                                }
                                value={item}
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
