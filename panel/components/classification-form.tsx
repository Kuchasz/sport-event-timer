import Icon from "@mdi/react";
import { Button } from "./button";
import { InferMutationInput, InferQueryOutput, trpc } from "../trpc";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck, mdiPlus } from "@mdi/js";
import { PoorInput } from "./poor-input";
import { useFormState } from "hooks";

type Classification = InferMutationInput<"classification.add">;
type InitialClassification = InferQueryOutput<"classification.classifications">[0];

type ClassificationFormProps = {
    onReject: () => void;
    onResolve: (classification: Classification) => void;
    initialClassification: InitialClassification;
};

export const ClassificationForm = ({ onReject, onResolve, initialClassification }: ClassificationFormProps) => {
    const [classification, changeHandler] = useFormState(initialClassification, [initialClassification]);
    const { data: ageCategories } = trpc.useQuery(["classification.age-categories", { classificationId: initialClassification.id }]);
    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow">
                    <Label>Name</Label>
                    <PoorInput value={classification.name} onChange={changeHandler("name")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Age categories</Label>
                    {ageCategories && ageCategories.map((a) => (
                        <div>
                            <span>{a.id}</span>
                            <span>{a.name}</span>
                        </div>
                    ))}
                    <Button className="w-full">
                        <Icon size={1} path={mdiPlus} />
                        <span className="ml-2">Add age category</span>
                    </Button>
                </div>
            </div>
            <div className="mt-4 flex">
                <Button onClick={() => onResolve({ ...classification, ageCategories: ageCategories! })}>
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
