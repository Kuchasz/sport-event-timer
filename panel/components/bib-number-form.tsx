import Icon from "@mdi/react";
import { Button } from "./button";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { useFormState } from "hooks";
import { AppRouterInputs } from "trpc";
import { PoorNumberInput } from "./poor-number-input";

type BibNumber = AppRouterInputs["bibNumber"]["add"];

type BibNumberFormProps = {
    onReject: () => void;
    onResolve: (BibNumber: BibNumber) => void;
    initialBibNumber: BibNumber;
};

export const BibNumberForm = ({ onReject, onResolve, initialBibNumber }: BibNumberFormProps) => {
    const [BibNumber, changeHandler] = useFormState(initialBibNumber, [initialBibNumber]);

    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow">
                    <Label>Bib Number</Label>
                    <PoorNumberInput value={BibNumber.number} onChange={changeHandler("number")} />
                </div>
            </div>
            <div className="mt-4 flex">
                <Button onClick={() => onResolve({ ...BibNumber })}>
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