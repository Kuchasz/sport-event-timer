import { Input } from "react-daisyui";

export const PoorInput = ({
    value,
    onChange
}: {
    value?: string | null;
    onChange: (event: { target: { value: string } }) => void;
}) => <Input value={value || ""} onChange={onChange} />;
