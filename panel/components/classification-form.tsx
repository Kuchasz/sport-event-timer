import { Button } from "./button";
import { Label } from "./label";
import { PoorInput } from "./poor-input";
import { useFormState } from "hooks";

import { AppRouterInputs } from "trpc";
type Classification = AppRouterInputs["classification"]["add"];

type ClassificationFormProps = {
    onReject: () => void;
    onResolve: (classification: Classification) => void;
    initialClassification: Classification;
};

export const ClassificationForm = ({ onReject, onResolve, initialClassification }: ClassificationFormProps) => {
    const [classification, changeHandler] = useFormState(initialClassification, [initialClassification]);

    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow">
                    <Label>Name</Label>
                    <PoorInput value={classification.name} onChange={changeHandler("name")} />
                </div>
            </div>
            <div className="mt-4 justify-between flex">
                <Button onClick={onReject} outline>
                    Cancel
                </Button>
                <Button onClick={() => onResolve({ ...classification })}>Save</Button>
            </div>
        </div>
    );
};
