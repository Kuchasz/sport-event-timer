import { Input } from "./input";

export const PoorNumberInput = ({
    value,
    onChange,
    placeholder,
}: {
    value?: number | null;
    onChange: (event: { target: { value: number | null | undefined } }) => void;
    placeholder: string;
}) => (
    <Input
        placeholder={placeholder}
        type="number"
        value={value || ""}
        onChange={e => onChange({ target: { value: isNaN(parseInt(e.currentTarget.value)) ? undefined : Number(e.currentTarget.value) } })}
    />
);
