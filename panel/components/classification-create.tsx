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
        name: "",
        categories: [
            // { isSpecial: false, name: "OPEN M", gender: "male" },
            // { isSpecial: false, name: "OPEN K", gender: "female" },
            // { isSpecial: false, name: "M20", minAge: 18, maxAge: 29, gender: "male" },
            // { isSpecial: false, name: "M30", minAge: 30, maxAge: 39, gender: "male" },
            // { isSpecial: false, name: "M40", minAge: 40, maxAge: 49, gender: "male" },
            // { isSpecial: false, name: "M50", minAge: 50, maxAge: 59, gender: "male" },
            // { isSpecial: false, name: "M60", minAge: 60, maxAge: 99, gender: "male" },
            // { isSpecial: false, name: "K20", minAge: 18, maxAge: 29, gender: "female" },
            // { isSpecial: false, name: "K30", minAge: 30, maxAge: 39, gender: "female" },
            // { isSpecial: false, name: "K40", minAge: 40, maxAge: 49, gender: "female" },
            // { isSpecial: false, name: "K50", minAge: 50, maxAge: 99, gender: "female" },
            // { isSpecial: true, name: "Policemans" },
            // { isSpecial: true, name: "Przeciszovians" },
            // { isSpecial: true, name: "Firefighters" },
        ],
    };

    return <ClassificationForm onReject={onReject} onResolve={onResolve} initialClassification={classification} />;
};
