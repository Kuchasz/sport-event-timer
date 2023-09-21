import { trpc } from "trpc-core";
import { ClassificationForm } from "./classification-form";
import { AppRouterInputs } from "trpc";

type CreateClassification = AppRouterInputs["classification"]["add"];

type ClassificationCreateProps = {
    raceId: number;
    onReject: () => void;
    onResolve: (classification: CreateClassification) => void;
};

export const ClassificationCreate = ({ raceId, onReject, onResolve }: ClassificationCreateProps) => {
    const addClassifiationMutation = trpc.classification.add.useMutation();

    const classification: CreateClassification = {
        id: 0,
        raceId,
        name: "",
    };

    const createClassification = async (classification: CreateClassification) => {
        await addClassifiationMutation.mutateAsync(classification);
        onResolve(classification);
    };

    return (
        <ClassificationForm
            isLoading={addClassifiationMutation.isLoading}
            onReject={onReject}
            onResolve={createClassification}
            initialClassification={classification}
        />
    );
};
