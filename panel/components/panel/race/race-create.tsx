import type { AppRouterInputs } from "trpc";
import { RaceForm } from "./race-form";
import { trpc } from "trpc-core";

type CreateRace = AppRouterInputs["race"]["add"];

type RaceCreateProps = {
    onReject: () => void;
    onResolve: (race: CreateRace) => void;
};

export const RaceCreate = ({ onReject, onResolve }: RaceCreateProps) => {
    const addRaceMutation = trpc.race.add.useMutation();

    const processRaceCreate = async (race: CreateRace) => {
        await addRaceMutation.mutateAsync(race);
        onResolve(race);
    };

    const race: CreateRace = {
        name: "",
        description: "",
        location: "",
        sportKind: "road-cycling",
        date: new Date(),
        registrationEnabled: false,
        useSampleData: false,
    };

    return <RaceForm isLoading={addRaceMutation.isLoading} onReject={onReject} onResolve={processRaceCreate} initialRace={race} />;
};
