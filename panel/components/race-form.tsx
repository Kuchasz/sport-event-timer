import { Button } from "./button";
import { Label } from "./label";
import { PoorUTCDatepicker } from "./poor-datepicker";
import { PoorInput } from "./poor-input";
import { useFormState } from "hooks";
import { AppRouterInputs } from "trpc";
import { PoorNumberInput } from "./poor-number-input";
import { PoorCheckbox } from "./poor-checkbox";
import { PoorTextArea } from "./poor-text-area";

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
                    <PoorUTCDatepicker value={race.date} onChange={changeHandler("date")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Players limit</Label>
                    <PoorNumberInput value={race.playersLimit} onChange={changeHandler("playersLimit")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Registration enabled</Label>
                    <PoorCheckbox value={race.registrationEnabled} onChange={changeHandler("registrationEnabled")} />
                </div>
                {!race.id && (
                    <>
                        <div className="p-2"></div>
                        <div className="grow">
                            <Label>Use sample data</Label>
                            <PoorCheckbox value={race.useSampleData} onChange={changeHandler("useSampleData")} />
                        </div>
                    </>
                )}
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Terms and conditions url</Label>
                    <PoorInput value={race.termsUrl} onChange={changeHandler("termsUrl")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Registration email appendix template</Label>
                    <PoorTextArea value={race.emailTemplate} onChange={changeHandler("emailTemplate")} />
                </div>
            </div>
            <div className="mt-4 justify-between flex">
                <Button onClick={onReject} outline>
                    Cancel
                </Button>
                <Button onClick={() => onResolve({ ...race })}>Save</Button>
            </div>
        </div>
    );
};
