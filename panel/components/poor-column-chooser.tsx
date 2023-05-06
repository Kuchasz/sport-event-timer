import { Listbox, Transition } from "@headlessui/react";
import { mdiEye, mdiEyeOff, mdiTableCog } from "@mdi/js";
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
    onChange: (event: { target: { value: T[TValueKey][] } }) => void;
}) => {
    const [selected, setSelected] = useState(initialValue ?? []);

    return (
        <Listbox
            value={selected}
            multiple={true}
            onChange={(e: T[TValueKey][]) => {
                setSelected(e);
                const selectedItemsValueKeys = e.map(ee => String(ee));
                const desiredItems = items.filter(i => selectedItemsValueKeys.includes(String(i[valueKey]))).map(i => i[valueKey]);
                onChange({ target: { value: desiredItems } });
            }}
        >
            <div className="">
                <Listbox.Button className="relative cursor-pointer rounded-lg bg-white py-2 px-5 text-left">
                    <Icon path={mdiTableCog} size={1} />
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
                                            <span className="absolute inset-y-0 left-0 flex items-center px-3">
                                                <Icon path={mdiEye} size={.7} />
                                            </span>
                                        ) : (
                                            <span className="absolute inset-y-0 left-0 flex text-gray-300 items-center px-3">
                                                <Icon path={mdiEyeOff} size={.7} />
                                            </span>
                                        )}
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
