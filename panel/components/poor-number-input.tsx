import { Input } from "./input";

export const PoorNumberInput = ({
    value,
    onChange,
    placeholder,
}:
    | {
          required?: false;
          value?: number | null;
          onChange: (event: { target: { value: number | null | undefined } }) => void;
          placeholder: string;
      }
    | {
          required?: true;
          value: number;
          onChange: (event: { target: { value: number } }) => void;
          placeholder: string;
      }) => (
    <Input
        placeholder={placeholder}
        type="number"
        value={value || ""}
        onChange={e => onChange({ target: { value: isNaN(parseInt(e.currentTarget.value)) ? 0 : Number(e.currentTarget.value) } })}
    />
);
