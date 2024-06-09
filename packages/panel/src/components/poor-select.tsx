import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

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

    return (
        <Select
            value={(selected as string) || undefined}
            onValueChange={value => {
                setSelected(value as T[TValueKey]);
                const desiredItem = items.find(i => String(i[valueKey]) === value)!;
                onChange({ target: { value: desiredItem[valueKey] } });
            }}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {items.map(item => (
                    <SelectItem key={item[valueKey] as string} value={item[valueKey] as string}>
                        {item[nameKey] as string}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
