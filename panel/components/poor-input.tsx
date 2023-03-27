import { Input } from "./input";

export const PoorInput = ({
    placeholder,
    value,
    onChange
}: {
    placeholder?: string;
    value?: string | null;
    onChange: (event: { target: { value: string } }) => void;
}) => <Input value={value || ""} placeholder={placeholder   } onChange={e => onChange({ target: { value: e.currentTarget.value } })} />;
