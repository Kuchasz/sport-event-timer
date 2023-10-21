import { Button } from "../../button";
import { Label } from "../../label";
import { PoorInput } from "../../poor-input";
import { useFormState } from "hooks";
import { AppRouterInputs } from "trpc";
import { PoorNumberInput } from "../../poor-number-input";
import { RadioGroup } from "@headlessui/react";
import classNames from "classnames";

type Category = AppRouterInputs["classification"]["addCategory"];

type CategoryFormProps = {
    onReject: () => void;
    onResolve: (category: Category) => void;
    initialCategory: Category;
    isLoading: boolean;
};

export const CategoryForm = ({ onReject, onResolve, initialCategory, isLoading }: CategoryFormProps) => {
    const [category, changeHandler] = useFormState(initialCategory, [initialCategory]);

    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow basis-full">
                    <Label>Name</Label>
                    <PoorInput value={category.name} onChange={changeHandler("name")}></PoorInput>
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Min Age</Label>
                    <PoorNumberInput value={category.minAge} onChange={changeHandler("minAge")}></PoorNumberInput>
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Max Age</Label>
                    <PoorNumberInput value={category.maxAge} onChange={changeHandler("maxAge")}></PoorNumberInput>
                </div>
                <div className="p-2"></div>
                <div className="grow basis-full">
                    <Label>Gender</Label>
                    <RadioGroup value={category.gender} onChange={e => changeHandler("gender")({ target: { value: e } })}>
                        <RadioGroup.Option value={null}>
                            {({ checked }) => (
                                <span className={classNames("cursor-pointer rounded-md p-1 text-xs", { ["bg-blue-200"]: checked })}>
                                    Any
                                </span>
                            )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="male">
                            {({ checked }) => (
                                <span className={classNames("cursor-pointer rounded-md p-1 text-xs", { ["bg-blue-200"]: checked })}>
                                    Male
                                </span>
                            )}
                        </RadioGroup.Option>
                        <RadioGroup.Option value="female">
                            {({ checked }) => (
                                <span className={classNames("cursor-pointer rounded-md p-1 text-xs", { ["bg-blue-200"]: checked })}>
                                    Female
                                </span>
                            )}
                        </RadioGroup.Option>
                    </RadioGroup>
                </div>
            </div>
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    Cancel
                </Button>
                <Button loading={isLoading} onClick={() => onResolve({ ...category })}>
                    Save
                </Button>
            </div>
        </div>
    );
};
