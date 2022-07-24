import { Input } from "./input";
import { milisecondsToTimeString, timeStringToMiliseconds } from "utils";
import { useState } from "react";

export const PoorTimepicker = ({
    value: initialValue,
    onChange
}: {
    value?: number;
    onChange: (event: { target: { value: number } }) => void;
}) => {
    const [value, setValue] = useState<string>(milisecondsToTimeString(initialValue));
    return (
        <Input
            value={value}
            onChange={e => {
                setValue(e.currentTarget.value);
            }}
            onBlur={e => {
                onChange({ target: { value: timeStringToMiliseconds(e.target.value) ?? 0 } });
            }}
        />
    );
};
