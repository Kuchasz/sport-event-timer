import { Input } from "./ui/input";

export const PoorInput = ({
    placeholder,
    value,
    onChange,
    className,
    password,
}: {
    placeholder?: string;
    value?: string | null;
    onChange: (event: { target: { value: string } }) => void;
    className?: string;
    password?: boolean;
}) => (
    <Input
        className={className}
        value={value || ""}
        placeholder={placeholder}
        type={password ? "password" : undefined}
        onChange={e => onChange({ target: { value: e.currentTarget.value } })}
    />
);
