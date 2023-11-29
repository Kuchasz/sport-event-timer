import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import Icon from "@mdi/react";
import { mdiChevronDoubleDown } from "@mdi/js";
import fuzzysort from "fuzzysort";

export type KeysOfType<T, X> = {
    [P in keyof T]: T[P] extends X ? P : never;
}[keyof T];

export const PoorCombo = ({
    items,
    initialValue,
    onChange,
    placeholder,
}: {
    initialValue: string | undefined | null;
    items: string[];
    onChange: (event: { target: { value: string } }) => void;
    placeholder?: string;
}) => {
    const [query, setQuery] = useState(initialValue ?? "");

    const filteredItems = fuzzysort.go(query, items, { all: true });

    return (
        <Combobox value={query}>
            <div className="relative mt-1">
                <div className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:border-orange-600 focus:ring-orange-600 sm:text-sm">
                    <Combobox.Input
                        placeholder={placeholder}
                        className="w-full rounded-lg bg-transparent py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                        value={query}
                        onChange={event => {
                            setQuery(event.target.value);
                            onChange(event);
                        }}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <Icon className="h-5 w-5" path={mdiChevronDoubleDown}></Icon>
                    </Combobox.Button>
                </div>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredItems.map(item => (
                            <Combobox.Option
                                onClick={() => setQuery(item.target)}
                                key={item.target}
                                className="relative cursor-default select-none py-2 pl-4 pr-4 text-gray-900"
                                value={item.target}>
                                <span className="block truncate font-normal">{item.target}</span>
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
};
