import { ClassificationForm } from "./classification-form";
import { AppRouterInputs, AppRouterOutputs } from "../../../trpc";
import { trpc } from "trpc-core";

type Classification = AppRouterOutputs["classification"]["classifications"][0];
type EditClassification = AppRouterInputs["classification"]["update"];

type ClassificationEditProps = {
    editedClassification: Classification;
    onReject: () => void;
    onResolve: (classification: EditClassification) => void;
};

export const ClassificationEdit = ({ editedClassification, onReject, onResolve }: ClassificationEditProps) => {
    const updateClassificationMutation = trpc.classification.update.useMutation();

    const editClassification = async (classification: EditClassification) => {
        await updateClassificationMutation.mutateAsync(classification);
        onResolve(classification);
    };

    return (
        <ClassificationForm
            isLoading={updateClassificationMutation.isLoading}
            onReject={onReject}
            onResolve={editClassification}
            initialClassification={editedClassification}
        />
    );
};
