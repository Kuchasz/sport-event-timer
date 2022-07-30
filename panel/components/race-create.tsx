import { InferMutationInput } from "../trpc";
import { RaceForm } from "./race-form";

type CreateRace = InferMutationInput<"race.add">;

type RaceCreateProps = {
    onReject: () => void;
    onResolve: (race: CreateRace) => void;
};

export const RaceCreate = ({ onReject, onResolve }: RaceCreateProps) => {
    const race: CreateRace = {
        name: "",
        date: new Date()
    };

    return <RaceForm onReject={onReject} onResolve={onResolve} initialRace={race} />;
};