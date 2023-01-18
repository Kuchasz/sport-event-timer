import { Input } from "./input";

export const PoorCheckbox = ({
    value,
    onChange
}: {
    value?: boolean | null;
    onChange: (event: { target: { value: boolean } }) => void;
}) => (
    <Input
        type="checkbox"
        checked={value || false}
        onChange={e => onChange({ target: { value: Boolean(e.currentTarget.value) } })}
    />
);
