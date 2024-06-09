import { Textarea } from "./ui/textarea";

export const PoorTextArea = ({
    placeholder,
    value,
    onChange,
}: {
    placeholder?: string;
    value?: string | null;
    onChange: (event: { target: { value: string } }) => void;
}) => <Textarea value={value || ""} placeholder={placeholder} onChange={e => onChange({ target: { value: e.currentTarget.value } })} />;
