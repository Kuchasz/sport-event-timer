import Icon from "@mdi/react";
import { Button } from "./button";
import { InferMutationInput, InferQueryOutput, trpc } from "../trpc";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { PoorInput } from "./poor-input";
import { useFormState } from "hooks";
// import { useQueryClient } from "react-query";

type Classification = InferMutationInput<"classification.add">;
type InitialClassification = InferQueryOutput<"classification.classifications">[0];

type ClassificationFormProps = {
    onReject: () => void;
    onResolve: (classification: Classification) => void;
    initialClassification: InitialClassification;
};

export const ClassificationForm = ({ onReject, onResolve, initialClassification }: ClassificationFormProps) => {
    const [classification, changeHandler] = useFormState(initialClassification, [initialClassification]);
    const { data: categories } = trpc.useQuery(["classification.categories", { classificationId: initialClassification.id }]);

    // const qc = useQueryClient();

    // const createCategory = () => {
    //     const category = {
    //         name: "New Category",
    //         gemder: "male",
    //     };

    //     qc.setQueryData(["classification.categories", { classificationId: initialClassification.id }], () => [...categories!, category]);
    // };

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
                    <Label>Categories</Label>
                    {categories &&
                        categories.map((a, i) => (
                            <div key={i}>
                                <span>{a.id}</span>
                                <span>{a.name}</span>
                            </div>
                        ))}
                    {/* <Button onClick={createCategory} className="w-full">
                        <Icon size={1} path={mdiPlus} />
                        <span className="ml-2">Add category</span>
                    </Button> */}
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="flex w-full">
                    <div className="flex bg-red-300 w-[33%] h-10 items-center justify-center text-white">0-33</div>
                    <div className="flex bg-orange-300 w-[50%] h-10 items-center justify-center text-white">34-76</div>
                    <div className="flex bg-yellow-300 w-[17%] h-10 items-center justify-center text-white">77-99</div>
                </div>
            </div>
            <div className="mt-4 flex">
                <Button onClick={() => onResolve({ ...classification, ageCategories: categories! })}>
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
