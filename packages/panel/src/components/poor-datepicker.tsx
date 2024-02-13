import { Input } from "./input";

const toDateString = (date: Date) => date.toLocaleDateString("en-CA");
const toDate = (dateString: string) => new Date(dateString);

export const PoorDatepicker = ({
    value: initialValue,
    onChange,
    placeholder,
}: {
    value?: Date;
    onChange: (event: { target: { value: Date } }) => void;
    placeholder?: string;
}) => {
    const value = initialValue ? toDateString(initialValue) : undefined;

    return (
        <Input
            placeholder={placeholder}
            defaultValue={value}
            onChange={e => {
                onChange({ target: { value: toDate(e.currentTarget.value) ?? new Date() } });
            }}
            type="date"
        />
    );
};

const toDateStringUTC = (date: Date) => date.toLocaleDateString("en-CA");
const toDateUTC = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const dateOffset = date.getTimezoneOffset();

    const finalDate = new Date(date.getTime() + dateOffset * 60_000);

    return finalDate;
};

export const PoorUTCDatepicker = ({
    required,
    value: initialValue,
    onChange,
    placeholder,
}:
    | {
          required: true;
          value?: Date | null;
          onChange: (event: { target: { value: Date } }) => void;
          placeholder?: string;
      }
    | {
          required?: false;
          value?: Date | null;
          onChange: (event: { target: { value: Date | null } }) => void;
          placeholder?: string;
      }) => {
    const value = initialValue ? toDateStringUTC(initialValue) : undefined;

    return (
        <Input
            required={required}
            placeholder={placeholder}
            defaultValue={value}
            onChange={e => {
                onChange({ target: { value: toDateUTC(e.currentTarget.value)! } });
            }}
            type="date"
        />
    );
};
