import { AppRouterTypes } from "trpc";
import { RaceForm } from "./race-form";

type CreateRace = AppRouterTypes["race"]["add"]["input"];

type RaceCreateProps = {
    onReject: () => void;
    onResolve: (race: CreateRace) => void;
};

export const RaceCreate = ({ onReject, onResolve }: RaceCreateProps) => {

    console.log('create reace');

    const race: CreateRace = {
        name: "",
        date: new Date()
    };

    return <RaceForm onReject={onReject} onResolve={onResolve} initialRace={race} />;
};
