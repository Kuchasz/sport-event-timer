import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
import { PlayerRegistrationForm } from "./player-registration-form";
import { trpc } from "src/trpc-core";
import { useCurrentRaceId } from "src/hooks";

type PlayerRegistration = AppRouterOutputs["playerRegistration"]["registrations"][0];
type EditPlayerRegistration = AppRouterInputs["playerRegistration"]["edit"]["player"];

type PlayerRegistrationEditProps = {
    editedPlayerRegistration: PlayerRegistration;
    onReject: () => void;
    onResolve: (player: EditPlayerRegistration) => void;
};

export const PlayerRegistrationEdit = ({ editedPlayerRegistration, onReject, onResolve }: PlayerRegistrationEditProps) => {
    const editPlayerRegistrationMutation = trpc.playerRegistration.edit.useMutation();
    const raceId = useCurrentRaceId();

    const playerRegistration: EditPlayerRegistration = {
        id: editedPlayerRegistration.id,
        birthDate: editedPlayerRegistration.birthDate,
        gender: editedPlayerRegistration.gender as "male" | "female",
        lastName: editedPlayerRegistration.lastName,
        name: editedPlayerRegistration.name,
        city: editedPlayerRegistration.city ?? "",
        country: editedPlayerRegistration.country ?? "PL",
        email: editedPlayerRegistration.email ?? "",
        icePhoneNumber: editedPlayerRegistration.icePhoneNumber,
        phoneNumber: editedPlayerRegistration.phoneNumber ?? "",
        team: editedPlayerRegistration.team,
        hasPaid: editedPlayerRegistration.hasPaid,
    };

    const processPlayerRegistrationEdit = async (editedPlayerRegistration: EditPlayerRegistration) => {
        await editPlayerRegistrationMutation.mutateAsync({ raceId, player: editedPlayerRegistration });
        onResolve(editedPlayerRegistration);
    };

    return (
        <PlayerRegistrationForm
            isLoading={editPlayerRegistrationMutation.isLoading}
            onReject={onReject}
            onResolve={processPlayerRegistrationEdit}
            initialPlayerRegistration={playerRegistration}
        />
    );
};
