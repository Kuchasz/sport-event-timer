import { TextArea } from "./text-area";

export const PoorTextArea = ({
    placeholder,
    value,
    onChange,
}: {
    placeholder?: string;
    value?: string | null;
    onChange: (event: { target: { value: string } }) => void;
}) => <TextArea value={value || ""} placeholder={placeholder} onChange={e => onChange({ target: { value: e.currentTarget.value } })} />;
