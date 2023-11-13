import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";
import { fullTimeStringToEpochMiliseconds, timeStringToMiliseconds } from "utils";
import { milisecondsToTimeString } from "@set/utils/dist/datetime";
import { Input } from "./input";
import { useState } from "react";

export const PoorTimepicker = ({
    value: initialValue,
    onChange,
    placeholder,
}: {
    value?: number;
    date?: number;
    placeholder?: string;
    onChange: (event: { target: { value: number } }) => void;
}) => {
    const [value, setValue] = useState<string>(milisecondsToTimeString(initialValue));
    return (
        <Input
            value={value}
            onChange={e => {
                setValue(e.currentTarget.value);

                const miliseconds = timeStringToMiliseconds(e.currentTarget.value);
                if (miliseconds.status === "Success") onChange({ target: { value: miliseconds.value } });
            }}
            placeholder={placeholder}
        />
    );
};

export const PoorFullTimepicker = ({
    value: initialValue,
    onChange,
    date,
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
                const miliseconds = fullTimeStringToEpochMiliseconds(e.currentTarget.value, date);
                if (miliseconds.status === "Success") onChange({ target: { value: miliseconds.value } });
            }}
        />
    );
};
