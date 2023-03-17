import { trpc } from "connection";
import { AppRouterInputs } from "trpc";
import { PlayerForm } from "./player-form";

type CreatePlayer = AppRouterInputs["player"]["add"]["player"];

type PlayerCreateProps = {
    raceId: number;
    onReject: () => void;
    onResolve: (player: CreatePlayer) => void;
};

export const PlayerCreate = ({ raceId, onReject, onResolve }: PlayerCreateProps) => {
    const { data: classifications } = trpc.classification.classifications.useQuery({ raceId: raceId! });
    const { data: availableNumbers } = trpc.bibNumber.availableNumbers.useQuery({ raceId: raceId! });
    if (!classifications || !availableNumbers) return;

    const player: CreatePlayer = {
        classificationId: classifications[0]?.id ?? 0,
        name: undefined as unknown as string,
        lastName: undefined as unknown as string,
        gender: "male",
        birthDate: new Date(1990, 0, 1)
    };

    return (
        <PlayerForm
            onReject={onReject}
            onResolve={onResolve}
            classifications={classifications}
            initialPlayer={player}
            bibNumbers={availableNumbers}
        />
    );
};
