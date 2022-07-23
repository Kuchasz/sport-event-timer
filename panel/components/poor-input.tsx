import { Input } from "./input";

export const PoorInput = ({
    value,
    onChange
}: {
    value?: string | null;
    onChange: (event: { target: { value: string } }) => void;
}) => <Input value={value || ""} onChange={e => onChange({ target: { value: e.currentTarget.value } })} />;
