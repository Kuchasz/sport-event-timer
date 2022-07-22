import { Input } from "react-daisyui";
import { useState } from "react";

const minuteMillis = 1_000 * 60;
const hourMillis = 1_000 * 60 * 60;

const toTimeString = (miliseconds: number) =>
    `${Math.floor(miliseconds / hourMillis)}:${Math.floor(
        (Math.floor(miliseconds / hourMillis) * hourMillis) / minuteMillis
    )}`;
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
                setValue(e.target.value);
            }}
            onBlur={e => {
                onChange({ target: { value: toMiliseconds(e.target.value) ?? 0 } });
            }}
        />
    );
};
