import { mdiEye, mdiEyeClosed, mdiTuneVariant } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { cn } from "src/utils";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu";

const DropdownMenuCheckboxItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            "focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-xs font-medium outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
            className,
        )}
        checked={checked}
        {...props}>
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
            {checked ? <Icon path={mdiEye} /> : <Icon path={mdiEyeClosed} />}
        </span>
        <span className={checked ? "" : "opacity-50"}>{children}</span>
    </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

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
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto hidden lg:flex">
                    <Icon className="mr-2" path={mdiTuneVariant} size={0.8} />
                    <span>{t("shared.dataTable.columns")}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuLabel>{t("shared.dataTable.toggleColumns")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {items.map(column => {
                    return (
                        <DropdownMenuCheckboxItem
                            key={String(column[nameKey])}
                            className="capitalize"
                            checked={selected.includes(String(column[valueKey]))}
                            onSelect={e => e.preventDefault()}
                            onCheckedChange={value => {
                                const desiredItems = value
                                    ? [...selected, String(column[valueKey])]
                                    : selected.filter(s => s !== String(column[valueKey]));

                                setSelected(desiredItems);

                                onChange({ target: { value: desiredItems as T[TValueKey][] } });
                            }}>
                            {String(column[nameKey])}
                        </DropdownMenuCheckboxItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
