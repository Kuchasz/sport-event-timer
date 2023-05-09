import { ClassificationForm } from "./classification-form";
import { AppRouterInputs } from "trpc";

type CreateClassification = AppRouterInputs["classification"]["add"];

type ClassificationCreateProps = {
    raceId: number;
    onReject: () => void;
    onResolve: (classification: CreateClassification) => void;
};

export const ClassificationCreate = ({ raceId, onReject, onResolve }: ClassificationCreateProps) => {
    const classification: CreateClassification = {
        id: 0,
        raceId,
        name: ""
    };

    return <ClassificationForm onReject={onReject} onResolve={onResolve} initialClassification={classification} />;
};
