import { InferMutationInput, trpc } from "../trpc";
import { PlayerForm } from "./player-form";

type CreatePlayer = InferMutationInput<"player.add">["player"];

type PlayerCreateProps = {
    raceId: number;
    onReject: () => void;
    onResolve: (player: CreatePlayer) => void;
};

export const PlayerEdit = ({ raceId, onReject, onResolve }: PlayerCreateProps) => {
    const { data: classifications } = trpc.useQuery(["classification.classifications", { raceId: raceId! }]);
    if (!classifications) return;

    const player: CreatePlayer = {
        classificationId: classifications ? classifications[0]?.id : 0,
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
        />
    );
};
