import { Input } from "./input";

export const PoorInput = ({
    placeholder,
    value,
    onChange,
    className,
}: {
    placeholder?: string;
    value?: string | null;
    onChange: (event: { target: { value: string } }) => void;
    className?: string;
}) => (
    <Input
        className={className}
        value={value || ""}
        placeholder={placeholder}
        onChange={e => onChange({ target: { value: e.currentTarget.value } })}
    />
);
