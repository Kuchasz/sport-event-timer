import { Input } from "react-daisyui";

export const PoorNumberInput = ({
    value,
    onChange
}: {
    value?: number | null;
    onChange: (event: { target: { value: number } }) => void;
}) => (
    <Input type="number" value={value || ""} onChange={e => onChange({ target: { value: Number(e.target.value) } })} />
);
