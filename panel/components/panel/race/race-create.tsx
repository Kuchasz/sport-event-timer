import type { AppRouterInputs } from "trpc";
import { RaceForm } from "./race-form";
import { trpc } from "trpc-core";
import { useLocale } from "next-intl";
import type { Locales } from "../../../i18n";

type CreateRace = AppRouterInputs["race"]["add"]["race"];

type RaceCreateProps = {
    onReject: () => void;
    onResolve: (race: CreateRace) => void;
};

export const RaceCreate = ({ onReject, onResolve }: RaceCreateProps) => {
    const addRaceMutation = trpc.race.add.useMutation();
    const locale = useLocale();

    const processRaceCreate = async (race: CreateRace) => {
        await addRaceMutation.mutateAsync({ locale: locale as Locales, race });
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
