import Icon from "@mdi/react";
import { Button } from "./button";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { PoorDatepicker } from "./poor-datepicker";
import { PoorInput } from "./poor-input";
import { useFormState } from "hooks";
import { AppRouterInputs } from "trpc";
import { PoorNumberInput } from "./poor-number-input";
import { PoorCheckbox } from "./poor-checkbox";

type Race = AppRouterInputs["race"]["add"];

type RaceFormProps = {
    onReject: () => void;
    onResolve: (race: Race) => void;
    initialRace: Race;
};

export const registrationEnabledValues = [
    { name: "Enabled", value: true },
    { name: "Disabled", value: false },
];

export const RaceForm = ({ onReject, onResolve, initialRace }: RaceFormProps) => {
    const [race, changeHandler] = useFormState(initialRace, [initialRace]);
    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow">
                    <Label>Name</Label>
                    <PoorInput value={race.name} onChange={changeHandler("name")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Date</Label>
                    <PoorDatepicker value={race.date} onChange={changeHandler("date")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Registration enabled</Label>
                    <PoorCheckbox value={race.registrationEnabled} onChange={changeHandler("registrationEnabled")} />
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Players limit</Label>
                    <PoorNumberInput value={race.playersLimit} onChange={changeHandler("playersLimit")} />
                </div>
            </div>
            <div className="mt-4 flex">
                <Button onClick={() => onResolve({ ...race })}>
                    <Icon size={1} path={mdiContentSaveCheck} />
                    <span className="ml-2">Save</span>
                </Button>
                <Button onClick={onReject} className="ml-2">
                    <Icon size={1} path={mdiClose} />
                    <span className="ml-2">Cancel</span>
                </Button>
            </div>
        </div>
    );
};
