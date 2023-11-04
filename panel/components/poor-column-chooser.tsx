import { Listbox, Transition } from "@headlessui/react";
import { mdiChevronDown, mdiEye, mdiEyeOff } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslations } from "next-intl";
import { Fragment, useState } from "react";

export const PoorColumnChooser = <T, TNameKey extends keyof T, TValueKey extends keyof T>({
    items,
    initialValue,
    nameKey,
    valueKey,
    onChange,
    className,
}: {
    initialValue?: string[];
    items: T[];
    className?: string;
    nameKey: TNameKey;
    valueKey: TValueKey;
    onChange: (event: { target: { value: T[TValueKey][] } }) => void;
}) => {
    const [selected, setSelected] = useState(initialValue ?? []);
    const t = useTranslations();

    return (
        <Listbox
            value={selected}
            multiple={true}
            onChange={(e: string[]) => {
                setSelected(e);
                const selectedItemsValueKeys = e.map(ee => String(ee));
                const desiredItems = items.filter(i => selectedItemsValueKeys.includes(String(i[valueKey]))).map(i => i[valueKey]);
                onChange({ target: { value: desiredItems } });
            }}
        >
            <div className={`flex ${className}`}>
                <Listbox.Button
                    style={{ height: "38px" }}
                    className="relative flex items-center justify-center rounded-md border border-gray-300 pl-4 pr-2.5 text-sm font-medium transition-all"
                >
                    <span>{t("shared.dataTable.columns")}</span>
                    <Icon className="ml-2" path={mdiChevronDown} size={0.8} />
                </Listbox.Button>
                <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-auto overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {items.map((item, personIdx) => (
                            <Listbox.Option
                                key={personIdx}
                                className={({ active }) =>
                                    `relative w-auto cursor-default select-none py-2 pl-10 pr-4 ${
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
                                                <Icon path={mdiEye} size={0.7} />
                                            </span>
                                        ) : (
                                            <span className="absolute inset-y-0 left-0 flex items-center px-3 text-gray-300">
                                                <Icon path={mdiEyeOff} size={0.7} />
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
