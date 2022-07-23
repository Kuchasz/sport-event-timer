import { Input } from "./input";
import { useState } from "react";

const minuteMillis = 1_000 * 60;
const hourMillis = 1_000 * 60 * 60;

const toTimeString = (miliseconds: number) =>
    `${String(Math.floor(miliseconds / hourMillis)).padStart(2, "0")}:${String(
        Math.floor((Math.floor(miliseconds / hourMillis) * hourMillis) / minuteMillis)
    ).padStart(2, "0")}`;

const toMiliseconds = (timeString: string) => {
    if (!/\d\d:\d\d/gm.test(timeString)) {
        alert("Passed value does not match pattern HH:MM");
        return undefined;
    }

    const [hour, minutes] = timeString.split(":");
    return minuteMillis * Number(minutes) + hourMillis * Number(hour);
};

export const PoorTimepicker = ({
    value: initialValue,
    onChange
}: {
    value?: number;
    onChange: (event: { target: { value: number } }) => void;
}) => {
    const [value, setValue] = useState<string>(toTimeString(initialValue ?? 0));
    return (
        <Input
            value={value}
            onChange={e => {
                setValue(e.currentTarget.value);
            }}
            onBlur={e => {
                onChange({ target: { value: toMiliseconds(e.target.value) ?? 0 } });
            }}
        />
    );
};
