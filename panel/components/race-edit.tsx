import { AppRouterTypes } from "trpc";
import { RaceForm } from "./race-form";

type Race = AppRouterTypes["race"]["races"]["output"][0];
type EditRace = AppRouterTypes["race"]["update"]["input"];

type RaceEditProps = {
    editedRace: Race;
    onReject: () => void;
    onResolve: (race: EditRace) => void;
};

export const RaceEdit = ({ editedRace, onReject, onResolve }: RaceEditProps) => (
    <RaceForm onReject={onReject} onResolve={onResolve} initialRace={editedRace} />
);
