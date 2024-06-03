import { Input } from "./input";

const toDateString = (date: Date, locale: string) => date.toLocaleDateString(locale);
const toDate = (dateString: string) => new Date(dateString);

export const PoorDatepicker = ({
    value: initialValue,
    onChange,
    placeholder,
    locale,
}: {
    value?: Date;
    onChange: (event: { target: { value: Date } }) => void;
    placeholder?: string;
    locale: string;
}) => {
    const value = initialValue ? toDateString(initialValue, locale) : undefined;

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
    locale,
}:
    | {
          required: true;
          value?: Date | null;
          onChange: (event: { target: { value: Date } }) => void;
          placeholder?: string;
          locale: string;
      }
    | {
          required?: false;
          value?: Date | null;
          onChange: (event: { target: { value: Date | null } }) => void;
          placeholder?: string;
          locale: string;
      }) => {
    const value = initialValue ? toDateString(initialValue, locale) : undefined;

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
