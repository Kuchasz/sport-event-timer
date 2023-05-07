import { ClassificationForm } from "./classification-form";
import { AppRouterInputs, AppRouterOutputs,  } from "../trpc";

type Classification = AppRouterOutputs["classification"]["classifications"][0];
type EditClassification = AppRouterInputs["classification"]["update"];

type ClassificationEditProps = {
    editedClassification: Classification;
    onReject: () => void;
    onResolve: (classification: EditClassification) => void;
};

export const ClassificationEdit = ({ editedClassification, onReject, onResolve }: ClassificationEditProps) =>
    <ClassificationForm onReject={onReject} onResolve={onResolve} initialClassification={editedClassification} />;
