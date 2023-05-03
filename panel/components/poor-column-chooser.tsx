import { Listbox, Transition } from "@headlessui/react";
import { mdiArrowUpDown, mdiCheck } from "@mdi/js";
import Icon from "@mdi/react";
import { Fragment, useState } from "react";

export const PoorColumnChooser = <T, TNameKey extends keyof T, TValueKey extends keyof T>({
    items,
    initialValue,
    nameKey,
    valueKey,
    onChange,
}: {
    initialValue?: T[TValueKey][];
    items: T[];
    nameKey: TNameKey;
    valueKey: TValueKey;
    onChange: (event: { target: { value: T[TValueKey] } }) => void;
}) => {
    const [selected, setSelected] = useState(initialValue ?? []);

    return (
        <Listbox
            value={selected}
            multiple={true}
            onChange={(e: T[TValueKey][]) => {
                setSelected(e);
                // const desiredItem = items.find(i => String(i[valueKey]) === String(e))!;
                // onChange({ target: { value: desiredItem[valueKey] } });
            }}
        >
            <div className="relative mt-1">
                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border-gray-300 border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <Icon path={mdiArrowUpDown} size={1} />
                    </span>
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 w-auto mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {items.map((item, personIdx) => (
                            <Listbox.Option
                                key={personIdx}
                                className={({ active }) =>
                                    `relative cursor-default select-none w-auto py-2 pl-10 pr-4 ${
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
