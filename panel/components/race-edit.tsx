import { InferMutationInput, InferQueryOutput } from "../trpc";
import { RaceForm } from "./race-form";

type Race = InferQueryOutput<"race.races">[0];
type EditRace = InferMutationInput<"race.update">;

type RaceEditProps = {
    editedRace: Race;
    onReject: () => void;
    onResolve: (player: EditRace) => void;
};

export const RaceEdit = ({ editedRace, onReject, onResolve }: RaceEditProps) => (
    <RaceForm onReject={onReject} onResolve={onResolve} initialRace={editedRace} />
);
