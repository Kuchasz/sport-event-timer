import { Input } from "react-daisyui";
import { useState } from "react";

const toDateString = (date: Date) => `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
const toDate = (dateString: string) => {
    if (!/\d\d?.\d\d?.\d\d\d\d/gm.test(dateString)) return undefined;

    const [day, month, year] = dateString.split(".");
    return new Date(Number(year), Number(month) - 1, Number(day));
};

const allowedCharacters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];

export const PoorDatepicker = ({
    value: initialValue,
    onChange
}: {
    value?: Date;
    onChange: (event: { target: { value: Date } }) => void;
}) => {
    const [value, setValue] = useState<string>(toDateString(initialValue ?? new Date()));
    // const dateTextValue = value ? toDateString(value) : "";
    return (
        <Input
            value={value}
            onChange={e => {
                setValue(e.target.value);
            }}
            onBlur={e => {
                onChange({ target: { value: toDate(e.target.value) ?? new Date() } });
            }}
        />
    );
};
