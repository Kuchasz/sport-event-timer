import type { AppRouterInputs } from "src/trpc";
import { PlayerRegistrationForm } from "./player-registration-form";
import { trpc } from "src/trpc-core";
import { useCurrentRaceId } from "src/hooks";

type CreatePlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];

type PlayerRegistrationCreateProps = {
    onReject: () => void;
    onResolve: (player: CreatePlayerRegistration) => void;
};

export const PlayerRegistrationCreate = ({ onReject, onResolve }: PlayerRegistrationCreateProps) => {
    const addPlayerRegistrationMutation = trpc.playerRegistration.add.useMutation();
    const raceId = useCurrentRaceId();

    const playerRegistration: CreatePlayerRegistration = {
        name: undefined as unknown as string,
        lastName: undefined as unknown as string,
        gender: "male",
        birthDate: new Date(1990, 0, 1),
        city: "",
        email: "",
        phoneNumber: "",
        country: "PL",
        hasPaid: false,
    };

    const processPlayerRegistrationCreate = async (player: CreatePlayerRegistration) => {
        await addPlayerRegistrationMutation.mutateAsync({ raceId: raceId, player });
        onResolve(player);
    };

    return (
        <PlayerRegistrationForm
            isLoading={addPlayerRegistrationMutation.isLoading}
            onReject={onReject}
            onResolve={processPlayerRegistrationCreate}
            initialPlayerRegistration={playerRegistration}
        />
    );
};
