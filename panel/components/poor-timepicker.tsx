import { Input } from "./input";
import { useState } from "react";

const secondMillis = 1_000;
const minuteMillis = secondMillis * 60;
const hourMillis = minuteMillis * 60;

const toTimeString = (miliseconds: number) => {
    const hours = Math.floor(miliseconds / hourMillis);
    const minutes = Math.floor((miliseconds - hours * hourMillis) / minuteMillis);

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

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
