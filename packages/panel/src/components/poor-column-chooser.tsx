import { mdiTuneVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu";

export const PoorColumnChooser = <T, TNameKey extends keyof T, TValueKey extends keyof T>({
    items,
    initialValue,
    nameKey,
    valueKey,
    onChange,
}: {
    initialValue?: string[];
    items: T[];
    nameKey: TNameKey;
    valueKey: TValueKey;
    onChange: (event: { target: { value: T[TValueKey][] } }) => void;
}) => {
    const t = useTranslations();
    const [selected, setSelected] = useState(initialValue ?? []);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto hidden lg:flex">
                    <Icon className="mr-2" path={mdiTuneVariant} size={0.8} />
                    <span>{t("shared.dataTable.columns")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>{t("shared.dataTable.toggleColumns")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {items.map(column => {
                    return (
                        <DropdownMenuCheckboxItem
                            key={String(column[nameKey])}
                            className="capitalize"
                            checked={selected.includes(String(column[valueKey]))}
                            onCheckedChange={value => {
                                const desiredItems = value
                                    ? [...selected, String(column[valueKey])]
                                    : selected.filter(s => s !== String(column[valueKey]));

                                setSelected(desiredItems);

                                onChange({ target: { value: desiredItems as T[TValueKey][] } });
                            }}>
                            {String(column[valueKey])}
                        </DropdownMenuCheckboxItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
