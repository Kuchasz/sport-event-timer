import { Button } from "./button";
import { Label } from "./label";
import { useFormState } from "hooks";
import { AppRouterInputs } from "trpc";
import { PoorInput } from "./poor-input";

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
                    <PoorInput value={BibNumber.number} onChange={changeHandler("number")} />
                </div>
            </div>
            <div className="mt-4 justify-between flex">
                <Button onClick={onReject} outline>
                    Cancel
                </Button>
                <Button onClick={() => onResolve({ ...BibNumber })}>Save</Button>
            </div>
        </div>
    );
};
