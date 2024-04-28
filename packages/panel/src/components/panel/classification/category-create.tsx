import { trpc } from "src/trpc-core";
import { CategoryForm } from "./category-form";
import type { AppRouterInputs } from "src/trpc";

type CreateCategory = AppRouterInputs["classification"]["addCategory"];

type CategoryCreateProps = {
    classificationId: number;
    onReject: () => void;
    onResolve: (category: CreateCategory) => void;
};

export const CategoryCreate = ({ classificationId, onReject, onResolve }: CategoryCreateProps) => {
    const addCategoryMutation = trpc.classification.addCategory.useMutation();

    const category: CreateCategory = {
        classificationId,
        name: "",
        abbrev: "",
        minAge: undefined,
        maxAge: undefined,
        isSpecial: false,
        gender: undefined,
    };

    const createCategory = async (category: CreateCategory) => {
        await addCategoryMutation.mutateAsync(category);
        onResolve(category);
    };

    return (
        <CategoryForm isLoading={addCategoryMutation.isLoading} onReject={onReject} onResolve={createCategory} initialCategory={category} />
    );
};
