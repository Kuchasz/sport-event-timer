import Icon from "@mdi/react";
import { Button } from "./button";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { useFormState } from "hooks";
import { AppRouterInputs } from "trpc";
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
                        value={addManyBibNumberConfig.startNumber}
                        onChange={e => changeHandler("startNumber")({ target: { value: e.target.value! } })}
                    />
                </div>
                <div className="ml-2 grow">
                    <Label>Range end</Label>
                    <PoorNumberInput
                        value={addManyBibNumberConfig.endNumber}
                        onChange={e => changeHandler("endNumber")({ target: { value: e.target.value! } })}
                    />
                </div>
                <div className="ml-2 grow">
                    <Label>Omit duplicates</Label>
                    <PoorCheckbox
                        value={addManyBibNumberConfig.omitDuplicates}
                        onChange={e => changeHandler("omitDuplicates")({ target: { value: e.target.value! } })}
                    />
                </div>
            </div>
            <div className="mt-4 justify-between flex">
                <Button onClick={onReject} outline>
                    <Icon size={1} path={mdiClose} />
                    <span className="ml-2">Cancel</span>
                </Button>
                <Button onClick={() => onResolve({ ...addManyBibNumberConfig })}>
                    <Icon size={1} path={mdiContentSaveCheck} />
                    <span className="ml-2">Save</span>
                </Button>
            </div>
        </div>
    );
};
