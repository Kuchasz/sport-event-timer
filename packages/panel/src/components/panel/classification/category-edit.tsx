import { CategoryForm } from "./category-form";
import type { AppRouterInputs, AppRouterOutputs } from "../../../trpc";
import { trpc } from "src/trpc-core";

type Category = AppRouterOutputs["classification"]["categories"][0];
type EditCategory = AppRouterInputs["classification"]["updateCategory"];

type CategoryEditProps = {
    editedCategory: Category;
    onReject: () => void;
    onResolve: (Category: EditCategory) => void;
};

export const CategoryEdit = ({ editedCategory, onReject, onResolve }: CategoryEditProps) => {
    const editCategoryMutation = trpc.classification.updateCategory.useMutation();

    const editCategory = async (category: EditCategory) => {
        await editCategoryMutation.mutateAsync({ ...category });
        onResolve(category);
    };

    return (
        <CategoryForm
            isLoading={editCategoryMutation.isPending}
            onReject={onReject}
            onResolve={editCategory}
            initialCategory={editedCategory}
        />
    );
};
