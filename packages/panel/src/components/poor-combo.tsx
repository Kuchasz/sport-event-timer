import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { cn } from "../utils";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export type KeysOfType<T, X> = {
    [P in keyof T]: T[P] extends X ? P : never;
}[keyof T];

export const PoorCombo = ({
    items,
    initialValue,
    onChange,
    placeholder,
    notFoundMessage,
    allowCustomValue = false,
}: {
    initialValue: string | undefined | null;
    items: string[];
    notFoundMessage: string;
    onChange: (event: { target: { value: string } }) => void;
    placeholder?: string;
    allowCustomValue?: boolean;
}) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(initialValue ?? "");

    const handleValueChange = (currentValue: string) => {
        const val = currentValue === value ? "" : currentValue;

        setValue(val);
        onChange({ target: { value: val } });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {value ? items.find(item => item === value) ?? value : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
                <Command>
                    <CommandInput
                        onInput={e => {
                            allowCustomValue && handleValueChange((e.target as HTMLInputElement).value);
                        }}
                        onKeyUp={e => {
                            if (e.key === "Enter") {
                                setOpen(false);
                            }
                        }}
                        placeholder={placeholder}
                    />
                    <CommandList>
                        <CommandEmpty>{notFoundMessage}</CommandEmpty>
                        <CommandGroup>
                            {items.map(item => (
                                <CommandItem
                                    key={item}
                                    value={item}
                                    onSelect={currentValue => {
                                        handleValueChange(currentValue);
                                        setOpen(false);
                                    }}>
                                    <Check className={cn("mr-2 h-4 w-4", value === item ? "opacity-100" : "opacity-0")} />
                                    {item}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
