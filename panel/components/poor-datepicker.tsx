import { Input } from "./input";

const toDateString = (date: Date) => date.toLocaleDateString("en-CA");
const toDate = (dateString: string) => new Date(dateString);

export const PoorDatepicker = ({
    value: initialValue,
    onChange,
    placeholder,
}: {
    value?: Date;
    onChange: (event: { target: { value: Date } }) => void;
    placeholder?: string;
}) => {
    const value = initialValue ? toDateString(initialValue) : undefined;

    return (
        <Input
            placeholder={placeholder}
            defaultValue={value}
            onChange={e => {
                onChange({ target: { value: toDate(e.currentTarget.value) ?? new Date() } });
            }}
            onBlur={e => {
                onChange({ target: { value: toDate(e.target.value) ?? new Date() } });
            }}
            type="date"
        />
    );
};
