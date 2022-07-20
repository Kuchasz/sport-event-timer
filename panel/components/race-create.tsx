import { InferMutationInput, InferQueryOutput } from "../trpc";
import { RaceForm } from "./race-form";

type CreateRace = InferMutationInput<"race.add">;

type RaceCreateProps = {
    onReject: () => void;
    onResolve: (player: CreateRace) => void;
};

export const RaceCreate = ({ onReject, onResolve }: RaceCreateProps) => {
    const race: CreateRace = {
        name: ""
    };

    return <RaceForm onReject={onReject} onResolve={onResolve} initialRace={race} />;
};
