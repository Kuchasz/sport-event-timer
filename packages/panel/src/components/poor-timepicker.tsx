import { useMask } from "@react-input/mask";
import { formatTimeWithMilliSec, milisecondsToTimeString } from "@set/utils/dist/datetime";
import { useState } from "react";
import { fullTimeStringToEpochMiliseconds, timeStringToMiliseconds } from "src/utils";
import { Input } from "./input";

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
    const inputRef = useMask({ mask: "__:__", replacement: { _: /\d/ }, showMask: true });

    const [value, setValue] = useState<string>(milisecondsToTimeString(initialValue));
    return (
        <Input
            inputRef={inputRef}
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
    className,
    value: initialValue,
    onChange,
    date,
}: {
    className?: string;
    value?: number;
    date: number;
    onChange: (event: { target: { value: number } }) => void;
}) => {
    const inputRef = useMask({ mask: "__:__:__.___", replacement: { _: /\d/ }, showMask: true });

    const [value, setValue] = useState<string>(formatTimeWithMilliSec(initialValue));

    return (
        <Input
            className={className}
            inputRef={inputRef}
            value={value}
            onChange={e => {
                setValue(e.currentTarget.value);
                const miliseconds = fullTimeStringToEpochMiliseconds(e.currentTarget.value, date);
                if (miliseconds.status === "Success") onChange({ target: { value: miliseconds.value } });
            }}
        />
    );
};
