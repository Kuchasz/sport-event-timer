import { CategoryForm } from "./category-form";
import { AppRouterInputs, AppRouterOutputs,  } from "../trpc";

type Category = AppRouterOutputs["classification"]["categories"][0];
type EditCategory = AppRouterInputs["classification"]["updateCategory"];

type CategoryEditProps = {
    editedCategory: Category;
    onReject: () => void;
    onResolve: (Category: EditCategory) => void;
};

export const CategoryEdit = ({ editedCategory, onReject, onResolve }: CategoryEditProps) =>
    <CategoryForm onReject={onReject} onResolve={onResolve} initialCategory={editedCategory} />;
