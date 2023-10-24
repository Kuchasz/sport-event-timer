import { Button } from "../../button";
import { Label } from "../../label";
import { PoorUTCDatepicker } from "../../poor-datepicker";
import { PoorInput } from "../../poor-input";
import { useFormState } from "hooks";
import type { AppRouterInputs } from "trpc";
import { PoorNumberInput } from "../../poor-number-input";
import { PoorCheckbox } from "../../poor-checkbox";
import { PoorTextArea } from "../../poor-text-area";
import { sportKinds } from "@set/utils/dist/sport-kind";
import { PoorSelect } from "components/poor-select";
import { useTranslations } from "next-intl";

type Race = AppRouterInputs["race"]["add"];

type RaceFormProps = {
    onReject: () => void;
    onResolve: (race: Race) => void;
    initialRace: Race;
    isLoading: boolean;
};

export const registrationEnabledValues = [
    { name: "Enabled", value: true },
    { name: "Disabled", value: false },
];

export const RaceForm = ({ onReject, onResolve, initialRace, isLoading }: RaceFormProps) => {
    const [race, changeHandler] = useFormState(initialRace, [initialRace]);
    const sportKindTranslations = useTranslations("shared.sportKinds");
    const sportKindsOptions = sportKinds.map(sk => ({ name: sportKindTranslations(sk), value: sk }));
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
                    <Label>Location</Label>
                    <PoorInput value={race.location} onChange={changeHandler("location")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Sport Kind</Label>
                    <PoorSelect
                        initialValue={race.sportKind}
                        items={sportKindsOptions}
                        placeholder="Select sport kind"
                        nameKey="name"
                        valueKey="value"
                        onChange={changeHandler("sportKind")}
                    />
                </div>
                <div className="p-2"></div>
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
                    <Label>Description</Label>
                    <PoorInput value={race.description} onChange={changeHandler("description")} />
                </div>
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
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    Cancel
                </Button>
                <Button loading={isLoading} onClick={() => onResolve({ ...race })}>
                    Save
                </Button>
            </div>
        </div>
    );
};
