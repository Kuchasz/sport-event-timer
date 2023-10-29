import { Button } from "./button";
import { Label } from "./label";
import { useFormState } from "hooks";
import type { AppRouterInputs } from "trpc";
import { PoorNumberInput } from "./poor-number-input";
import { PoorCheckbox } from "./poor-checkbox";

type CreateManyBibNumbers = AppRouterInputs["bibNumber"]["addRange"];

type BibNumberFormProps = {
    onReject: () => void;
    onResolve: (result: CreateManyBibNumbers) => void;
    initialConfig: CreateManyBibNumbers;
};

export const BibNumberCreateManyForm = ({ onReject, onResolve, initialConfig }: BibNumberFormProps) => {
    const [addManyBibNumberConfig, changeHandler] = useFormState(initialConfig, [initialConfig]);

    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow">
                    <Label>Range start</Label>
                    <PoorNumberInput
                        placeholder="First Bib Number"
                        value={addManyBibNumberConfig.startNumber}
                        onChange={e => changeHandler("startNumber")({ target: { value: e.target.value! } })}
                    />
                </div>
                <div className="ml-2 grow">
                    <Label>Range end</Label>
                    <PoorNumberInput
                        placeholder="Last Bib Number"
                        value={addManyBibNumberConfig.endNumber}
                        onChange={e => changeHandler("endNumber")({ target: { value: e.target.value! } })}
                    />
                </div>
                <div className="ml-2 grow">
                    <Label>Omit duplicates</Label>
                    <PoorCheckbox
                        value={addManyBibNumberConfig.omitDuplicates}
                        onChange={e => changeHandler("omitDuplicates")({ target: { value: e.target.value } })}
                    />
                </div>
            </div>
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    Cancel
                </Button>
                <Button onClick={() => onResolve({ ...addManyBibNumberConfig })}>Save</Button>
            </div>
        </div>
    );
};
