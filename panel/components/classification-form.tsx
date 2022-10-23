import Icon from "@mdi/react";
import { Button } from "./button";
import { InferMutationInput } from "../trpc";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck, mdiPlus } from "@mdi/js";
import { PoorInput } from "./poor-input";
import { useFormState } from "hooks";
import { useQueryClient } from "react-query";
import { groupBy } from "@set/utils/dist/array";

type Classification = AppRouterTypes["classification"]["add"]["input"];

type ClassificationFormProps = {
    onReject: () => void;
    onResolve: (classification: Classification) => void;
    initialClassification: Classification;
};

const getColorFromIndex = (index: number) =>
    ({
        0: "bg-red-300",
        1: "bg-orange-300",
        2: "bg-yellow-300",
        3: "bg-green-300",
        4: "bg-indigo-300",
        5: "bg-pink-300",
        6: "bg-lime-300",
    }[index]);

const getPercentage = (category: { minAge?: number; maxAge?: number }) => {
    const range = (category.maxAge ?? Number.MAX_VALUE) - (category.minAge ?? 0);

    return (100 / (99 - 18 - 4)) * range + "%";
};

export const ClassificationForm = ({ onReject, onResolve, initialClassification }: ClassificationFormProps) => {
    const [classification, changeHandler] = useFormState(initialClassification, [initialClassification]);

    const categories = initialClassification.ageCategories;

    const qc = useQueryClient();

    const createCategory = () => {
        const category = {
            name: "New Category",
            gemder: "male",
        };

        qc.setQueryData(["classification.categories", { classificationId: initialClassification.id }], () => [...categories!, category]);
    };

    const autoCategories = categories.filter((c) => c.isSpecial === true);
    const openCategories = categories.filter((c) => c.isSpecial === false && c.minAge === undefined && c.maxAge === undefined);

    const ageCategories = Object.entries(
        groupBy(
            categories.filter((c) => c.minAge !== undefined || c.maxAge !== undefined),
            (c) => c.gender ?? ""
        )
    );

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
                    <Button onClick={createCategory} className="w-full">
                        <Icon size={1} path={mdiPlus} />
                        <span className="ml-2">Add category</span>
                    </Button>
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>OPEN Categories</Label>
                    <div className="flex py-2 items-center text-xs text-blue-900">
                        <Icon size={0.8} path={mdiPlus} />
                        <span className="ml-1">Add category</span>
                    </div>
                    {openCategories.map((a, i) => (
                        <div key={i}>
                            <span>{a.id}</span>
                            <span>{a.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>AGE Categories</Label>
                    <div className="flex py-2 items-center text-xs text-blue-900">
                        <Icon size={0.8} path={mdiPlus} />
                        <span className="ml-1">Add category</span>
                    </div>
                    {ageCategories.map(([_, categories]) => (
                        <div className="flex">
                            {categories.map((c, i) => (
                                <span
                                    style={{ width: getPercentage(c) }}
                                    className={`flex hover:opacity-80 cursor-pointerł ${getColorFromIndex(
                                        i
                                    )} h-10 items-center justify-center text-white`}
                                >
                                    {c.minAge}-{c.maxAge}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>SPECIAL Categories</Label>
                    <div className="flex py-2 items-center text-xs text-blue-900">
                        <Icon size={0.8} path={mdiPlus} />
                        <span className="ml-1">Add category</span>
                    </div>
                    {autoCategories.map((a, i) => (
                        <div key={i}>
                            <span>{a.id}</span>
                            <span>{a.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-2"></div>
            {/* {categoriesByGender.map(([_, categories]) => (
                <div className="flex">
                    {categories.map((c, i) => (
                        <span
                            style={{ width: getPercentage(c) }}
                            className={`flex hover:opacity-80 cursor-pointerł ${getColorFromIndex(
                                i
                            )} h-10 items-center justify-center text-white`}
                        >
                            {c.minAge}-{c.maxAge}
                        </span>
                    ))}
                </div>
            ))} */}
            {/* <div className="flex">
                {categories.map((c, i) => (
                    <span
                        style={{ width: getPercentage(c) }}
                        className={`flex hover:opacity-80 cursor-pointerł ${getColorFromIndex(
                            i
                        )} h-10 items-center justify-center text-white`}
                    >
                        {c.minAge}-{c.maxAge}
                    </span>
                ))}
            </div> */}
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
