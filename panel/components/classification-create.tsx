import { ClassificationForm } from "./classification-form";
import { InferMutationInput } from "../trpc";

type CreateClassification = InferMutationInput<"classification.add">;

type ClassificationCreateProps = {
    raceId: number;
    onReject: () => void;
    onResolve: (classification: CreateClassification) => void;
};

export const ClassificationCreate = ({ raceId, onReject, onResolve }: ClassificationCreateProps) => {
    const classification: CreateClassification = {
        raceId,
        name: ""
    };

    return <ClassificationForm onReject={onReject} onResolve={onResolve} initialClassification={classification} />;
};
