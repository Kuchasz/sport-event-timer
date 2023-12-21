import { Input } from "./input";

export const PoorCheckbox = ({
    value,
    onChange,
    label,
}: {
    name?: string;
    value?: boolean | null;
    onChange: (event: { target: { value: boolean } }) => void;
    label?: string;
}) => (
    <div style={{ height: "38px" }} className="flex w-full items-center">
        <Input
            type="checkbox"
            height={"auto"}
            width={"auto"}
            className="ml-4 cursor-pointer"
            checked={value!}
            onChange={() => {
                onChange({ target: { value: !value } });
            }}
        />
        {label && <span className="ml-2 w-full">{label}</span>}
    </div>
);
