import { Checkbox } from "./ui/checkbox";

export const PoorCheckbox = ({
    value,
    onChange,
    label,
    description,
}: {
    name?: string;
    value?: boolean | null;
    onChange: (event: { target: { value: boolean } }) => void;
    label?: string;
    description?: string;
}) => (
    <div className="items-top flex space-x-2">
        <Checkbox
            id="terms1"
            checked={value!}
            onCheckedChange={() => {
                onChange({ target: { value: !value } });
            }}
        />
        {(label || description) && (
            <div className="grid gap-1.5 leading-none">
                {label && (
                    <label
                        htmlFor="terms1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {label}
                    </label>
                )}
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
        )}
    </div>
);
