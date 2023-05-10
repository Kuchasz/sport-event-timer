import Icon from "@mdi/react";

import { mdiPlus, mdiTrashCanOutline } from "@mdi/js";

import { useCurrentRaceId } from "hooks";
// import { useQueryClient } from "@tanstack/react-query";
import { groupBy } from "@set/utils/dist/array";
import { AppRouterOutputs } from "trpc";
import { useState } from "react";

import { RadioGroup } from "@headlessui/react";
import { Gender } from "@set/utils/dist/gender";
import classNames from "classnames";
import { Label } from "components/label";
import { PoorInput } from "components/poor-input";
import { PoorNumberInput } from "components/poor-number-input";
import { Button } from "components/button";
import { trpc } from "connection";
import { useRouter } from "next/router";

export const useCurrentClassificationId = () => {
    const { classificationId } = useRouter().query;

    return classificationId ? parseInt(classificationId as string) : undefined;
};

// type Classification = AppRouterInputs["classification"]["add"];
type Category = AppRouterOutputs["classification"]["categories"][0];

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

// const getPercentage = (category: { minAge?: number; maxAge?: number }) => {
//     const range = (category.maxAge ?? Number.MAX_VALUE) - (category.minAge ?? 0);

//     return (100 / (99 - 18 - 4)) * range + "%";
// };

type GenderOptions = Gender | "none";

export const ClassificationCategories = () => {
    const raceId = useCurrentRaceId();
    const classificationId = useCurrentClassificationId();
    const { data: categories, refetch: refetchCategories } = trpc.classification.categories.useQuery(
        { classificationId: classificationId! },
        { initialData: [], enabled: !!classificationId }
    );
    const addCategoryMutation = trpc.classification.addCategory.useMutation();
    const removeCategoryMutation = trpc.classification.removeCategory.useMutation();

    const [categoryName, setCategoryName] = useState("");
    const [minAge, setMinAge] = useState<number | undefined | null>(1);
    const [maxAge, setMaxAge] = useState<number | undefined | null>(99);
    const [gender, setGender] = useState<GenderOptions>("none");

    // const [categories, setCategories] = useState(initialClassification.categories);

    // const qc = useQueryClient();

    const addCategory = async () => {
        // const category = {
        //     name: "New Category",
        //     gender: "male",
        // };

        // qc.setQueryData(["classification.categories", { classificationId: initialClassification.id }], () => [...categories!, category]);

        // setCategories([...categories!, { isSpecial: false, name: categoryName, gender: gender, minAge, maxAge }]);

        // setCategoryName("");
        // setMinAge(1);
        // setMaxAge(99);
        // setGender(undefined);
        await addCategoryMutation.mutateAsync({
            minAge,
            maxAge,
            gender: gender === "none" ? undefined : (gender as Gender),
            isSpecial: false,
            name: categoryName,
            raceId: raceId!,
            classificationId: classificationId!,
        });
        refetchCategories();
    };

    const removeCategory = async (category: Category) => {
        await removeCategoryMutation.mutateAsync({ categoryId: category.id });
        refetchCategories();
    };

    const autoCategories = categories.filter(c => c.isSpecial === true);
    const openCategories = categories.filter(c => c.isSpecial === false && c.minAge == null && c.maxAge == null);

    const ageCategories = Object.entries(
        groupBy(
            categories.filter(c => c.minAge != null || c.maxAge != null),
            c => c.gender ?? ""
        )
    );

    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow basis-full">
                    <Label>Name</Label>
                    <PoorInput
                        value={categoryName}
                        onChange={e => {
                            setCategoryName(e.target.value);
                        }}
                    ></PoorInput>
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Min Age</Label>
                    <PoorNumberInput
                        value={minAge}
                        onChange={e => {
                            setMinAge(e.target.value);
                        }}
                    ></PoorNumberInput>
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Max Age</Label>
                    <PoorNumberInput
                        value={maxAge}
                        onChange={e => {
                            setMaxAge(e.target.value);
                        }}
                    ></PoorNumberInput>
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Gender</Label>
                    <RadioGroup
                        value={gender}
                        onChange={e => {
                            setGender(e);
                        }}
                    >
                        <RadioGroup.Option value={"none"}>
                            {({ checked }) => (
                                <span className={classNames("cursor-pointer text-xs p-1 rounded-md", { ["bg-blue-200"]: checked })}>
                                    None
                                </span>
                            )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="male">
                            {({ checked }) => (
                                <span className={classNames("cursor-pointer text-xs p-1 rounded-md", { ["bg-blue-200"]: checked })}>
                                    Male
                                </span>
                            )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="female">
                            {({ checked }) => (
                                <span className={classNames("cursor-pointer text-xs p-1 rounded-md", { ["bg-blue-200"]: checked })}>
                                    Female
                                </span>
                            )}
                        </RadioGroup.Option>
                    </RadioGroup>
                </div>
            </div>
            <div className="flex">
                <div className="grow">
                    <Button onClick={addCategory} className="w-full">
                        <Icon size={1} path={mdiPlus} />
                        <span className="ml-2">Add category</span>
                    </Button>
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>OPEN Categories</Label>
                    {/* <div className="flex py-2 items-center text-xs text-blue-900">
                        <Icon size={0.8} path={mdiPlus} />
                        <span className="ml-1">Add category</span>
                    </div> */}
                    {openCategories.map((a, i) => (
                        <div key={i}>
                            <span>{a.id}</span>
                            <span> ({a.gender}) </span>
                            <span>{a.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>AGE Categories</Label>
                    {ageCategories.map(([gender, categories]) => (
                        <div key={gender} className="flex flex-col">
                            <div>{gender || "open"}</div>
                            <div className="flex">
                                {categories.map((c, i) => (
                                    <div
                                        key={c.id}
                                        className={`flex min-w-36 px-4 hover:opacity-80 cursor-pointer ${getColorFromIndex(
                                            i
                                        )} items-center justify-center text-white`}
                                    >
                                        <div className="grow py-1">
                                            <div>{c.name}</div>
                                            <div>
                                                {c.minAge} - {c.maxAge}
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => {
                                                removeCategory(c);
                                            }}
                                        >
                                            <Icon size={1} className="hover:text-black ml-2" path={mdiTrashCanOutline}></Icon>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>SPECIAL Categories</Label>
                    {/* <div className="flex py-2 items-center text-xs text-blue-900">
                        <Icon size={0.8} path={mdiPlus} />
                        <span className="ml-1">Add category</span>
                    </div> */}
                    {autoCategories.map((a, i) => (
                        <div key={i}>
                            <span>{a.id}</span>
                            <span>{a.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-2"></div>
            <div className="mt-4 flex">
                {/* <Button onClick={() => onResolve({ ...classification, categories: categories! })}>
                    <Icon size={1} path={mdiContentSaveCheck} />
                    <span className="ml-2">Save</span>
                </Button>
                <Button onClick={onReject} className="ml-2">
                    <Icon size={1} path={mdiClose} />
                    <span className="ml-2">Cancel</span>
                </Button> */}
            </div>
        </div>
    );
};

export default ClassificationCategories;
