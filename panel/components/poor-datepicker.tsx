import { Input } from "./input";

const toDateString = (date: Date) => date.toLocaleDateString("en-CA");
const toDate = (dateString: string) => new Date(dateString);

export const PoorDatepicker = ({
    value: initialValue,
    onChange,
}: {
    value?: Date;
    onChange: (event: { target: { value: Date } }) => void;
}) => {
    const value = toDateString(initialValue ?? new Date());

    return (
        <Input
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
