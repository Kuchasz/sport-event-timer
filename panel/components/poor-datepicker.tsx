import { Input } from "./input";
import { useState } from "react";

const toDateString = (date: Date) => `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
const toDate = (dateString: string) => {
    if (!/\d\d?.\d\d?.\d\d\d\d/gm.test(dateString)) {
        alert("Passed value does not match pattern DD.MM.YYYY");
        return undefined;
    }

    const [day, month, year] = dateString.split(".");
    return new Date(Number(year), Number(month) - 1, Number(day));
};

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
                setValue(e.currentTarget.value);
            }}
            onBlur={e => {
                onChange({ target: { value: toDate(e.target.value) ?? new Date() } });
            }}
        />
    );
};
