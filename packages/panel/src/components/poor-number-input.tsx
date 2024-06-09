import { Input } from "./ui/input";

export const PoorNumberInput = <T extends number | null | undefined>({
    value,
    onChange,
    placeholder,
}: {
    value: T;
    onChange: (event: { target: { value: T } }) => void;
    placeholder: string;
}) => (
    <Input
        placeholder={placeholder}
        type="number"
        value={value ? String(value) : ""}
        onChange={e => onChange({ target: { value: (isNaN(parseInt(e.currentTarget.value)) ? 0 : Number(e.currentTarget.value)) as T } })}
    />
);
