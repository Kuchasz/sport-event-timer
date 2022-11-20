import { AppRouterOutputs, AppRouterInputs } from "trpc";
import { RaceForm } from "./race-form";

type Race = AppRouterOutputs["race"]["races"][0];
type EditRace = AppRouterInputs["race"]["update"];

type RaceEditProps = {
    editedRace: Race;
    onReject: () => void;
    onResolve: (race: EditRace) => void;
};

export const RaceEdit = ({ editedRace, onReject, onResolve }: RaceEditProps) => (
    <RaceForm onReject={onReject} onResolve={onResolve} initialRace={editedRace} />
);
