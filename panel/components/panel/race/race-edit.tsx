import { AppRouterOutputs, AppRouterInputs } from "trpc";
import { RaceForm } from "./race-form";
import { trpc } from "trpc-core";

type Race = AppRouterOutputs["race"]["races"][0];
type EditRace = AppRouterInputs["race"]["update"];

type RaceEditProps = {
    editedRace: Race;
    onReject: () => void;
    onResolve: (race: EditRace) => void;
};

export const RaceEdit = ({ editedRace, onReject, onResolve }: RaceEditProps) => {
    const updateRaceMutation = trpc.race.update.useMutation();

    const processRaceEdit = async (race: EditRace) => {
        await updateRaceMutation.mutateAsync(race);
        onResolve(race);
    };

    return <RaceForm isLoading={updateRaceMutation.isLoading} onReject={onReject} onResolve={processRaceEdit} initialRace={editedRace} />;
};
