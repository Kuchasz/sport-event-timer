import { CategoryForm } from "./category-form";
import { AppRouterInputs } from "trpc";

type CreateCategory = AppRouterInputs["classification"]["addCategory"];

type CategoryCreateProps = {
    classificationId: number;
    onReject: () => void;
    onResolve: (category: CreateCategory) => void;
};

export const CategoryCreate = ({ classificationId, onReject, onResolve }: CategoryCreateProps) => {
    const category: CreateCategory = {
        id: 0,
        classificationId,
        name: "",
        minAge: undefined,
        maxAge: undefined,
        isSpecial: false,
        gender: undefined,
    };

    return <CategoryForm onReject={onReject} onResolve={onResolve} initialCategory={category} />;
};
