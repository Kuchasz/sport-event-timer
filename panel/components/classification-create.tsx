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
        id: 0,
        raceId,
        name: "",
        ageCategories: [
            { name: "M20", minAge: 18, maxAge: 29, gender: "male" },
            { name: "M30", minAge: 30, maxAge: 39, gender: "male" },
            { name: "M40", minAge: 40, maxAge: 49, gender: "male" },
            { name: "M50", minAge: 50, maxAge: 59, gender: "male" },
            { name: "M60", minAge: 60, maxAge: 99, gender: "male" },
            { name: "K20", minAge: 18, maxAge: 29, gender: "female" },
            { name: "K30", minAge: 30, maxAge: 39, gender: "female" },
            { name: "K40", minAge: 40, maxAge: 49, gender: "female" },
            { name: "K50", minAge: 50, maxAge: 99, gender: "female" },
        ],
    };

    return <ClassificationForm onReject={onReject} onResolve={onResolve} initialClassification={classification} />;
};
