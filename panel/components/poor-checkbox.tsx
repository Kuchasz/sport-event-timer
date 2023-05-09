import { Input } from "./input";

export const PoorCheckbox = ({
    value,
    onChange,
}: {
    value?: boolean | null;
    onChange: (event: { target: { value: boolean } }) => void;
}) => (
    <Input
        type="checkbox"
        checked={value!}
        onChange={() => {
            onChange({ target: { value: !value } });
        }}
    />
);
