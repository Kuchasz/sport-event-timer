import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "src/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const DatePicker = ({ value, onChange }: { value?: Date; onChange: (arg: { target: { value?: Date } }) => void }) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value, "PPP") : <span>Pick a date</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={value} onSelect={val => onChange({ target: { value: val } })} initialFocus />
        </PopoverContent>
    </Popover>
);

export const PoorDatepicker = ({
    value: initialValue,
    onChange,
}: {
    value?: Date;
    onChange: (event: { target: { value: Date } }) => void;
    placeholder?: string;
    locale: string;
}) => <DatePicker value={initialValue} onChange={e => onChange({ target: { value: e.target.value ?? new Date() } })} />;

const toDateUTC = (date: Date) => {
    const dateOffset = date.getTimezoneOffset();

    const finalDate = new Date(date.getTime() + dateOffset * 60_000);

    return finalDate;
};

export const PoorUTCDatepicker = ({
    value: initialValue,
    onChange,
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
      }) => (
    <DatePicker
        value={initialValue ?? new Date()}
        onChange={e => {
            onChange({ target: { value: toDateUTC(e.target.value ?? new Date())! } });
        }}
    />
);
