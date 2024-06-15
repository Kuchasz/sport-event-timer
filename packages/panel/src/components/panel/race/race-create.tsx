import { stripTime } from "@set/utils/dist/datetime";
import { useLocale } from "next-intl";
import type { AppRouterInputs } from "src/trpc";
import { trpc } from "src/trpc-core";
import type { Locales } from "../../../i18n/locales";
import { RaceForm } from "./race-form";

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
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        sportKind: "road-cycling",
        date: stripTime(new Date()),
        registrationEnabled: false,
        useSampleData: false,
    };

    return <RaceForm isLoading={addRaceMutation.isPending} onReject={onReject} onResolve={processRaceCreate} initialRace={race} />;
};
