import { Input } from "./input";

export const PoorNumberInput = ({
    value,
    onChange
}: {
    value?: number | null;
    onChange: (event: { target: { value: number } }) => void;
}) => (
    <Input
        type="number"
        value={value || ""}
        onChange={e => onChange({ target: { value: Number(e.currentTarget.value) } })}
    />
);
