import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";
import { fullTimeStringToMiliseconds, milisecondsToTimeString, timeStringToMiliseconds } from "utils";
import { Input } from "./input";
import { useState } from "react";

export const PoorTimepicker = ({
    value: initialValue,
    date,
    onChange
}: {
    value?: number;
    date?: number;
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
                onChange({ target: { value: (date ?? 0) + (timeStringToMiliseconds(e.target.value) ?? 0) } });
            }}
        />
    );
};

export const PoorFullTimepicker = ({
    value: initialValue,
    date,
    onChange
}: {
    value?: number;
    date: number;
    onChange: (event: { target: { value: number } }) => void;
}) => {
    const [value, setValue] = useState<string>(formatTimeWithMilliSec(initialValue));
    return (
        <Input
            value={value}
            onChange={e => {
                setValue(e.currentTarget.value);
            }}
            onBlur={e => {
                onChange({ target: { value: date + (fullTimeStringToMiliseconds(e.target.value) ?? 0) } });
            }}
        />
    );
};
