import { Select } from "react-daisyui";

export const PoorSelect = <T, TNameKey extends keyof T, TValueKey extends keyof T>({
    initialValue,
    items,
    nameKey,
    valueKey,
    onChange
}: {
    initialValue: T[TValueKey];
    items: T[];
    nameKey: TNameKey;
    valueKey: TValueKey;
    onChange: (event: { target: { value: T[TValueKey] } }) => void;
}) => (
    <Select
        initialValue={initialValue}
        onChange={(e: T[TValueKey]) => {
            const desiredItem = items.find(i => String(i[valueKey]) === String(e))!;
            onChange({ target: { value: desiredItem[valueKey] } });
        }}
    >
        {items.map(i => (
            <Select.Option value={i[valueKey] as unknown as string | number | undefined}>
                {i[nameKey] as unknown as string | number | undefined}
            </Select.Option>
        ))}
    </Select>
);
