import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

export const PoorRadioGroup = <T,>({
    children,
    value,
    onChange,
}: {
    children: React.ReactNode;
    value: T;
    onChange: (props: { target: { value: T } }) => void;
}) => (
    <RadioGroup onValueChange={value => onChange({ target: { value: value as T } })} defaultValue={(value ?? "") as string}>
        {children}
    </RadioGroup>
);

export const PoorRadioGroupItem = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center space-x-2">{children}</div>
);

type PoorRadioGroupOptionProps = { value: string | null | undefined } & Omit<React.ComponentProps<typeof RadioGroupItem>, "value">;

export const PoorRadioGroupOption = ({ value, ...props }: PoorRadioGroupOptionProps) => (
    <RadioGroupItem {...props} value={value as unknown as string} />
);
export const PoorRadioGroupLabel = Label;
