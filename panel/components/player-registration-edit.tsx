import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { PlayerRegistrationForm } from "./player-registration-form";

type PlayerRegistration = AppRouterOutputs["playerRegistration"]["registrations"][0];
type EditPlayerRegistration = AppRouterInputs["playerRegistration"]["edit"]["player"];

type PlayerRegistrationEditProps = {
    editedPlayerRegistration: PlayerRegistration;
    onReject: () => void;
    onResolve: (player: EditPlayerRegistration) => void;
};

export const PlayerRegistrationEdit = ({ editedPlayerRegistration, onReject, onResolve }: PlayerRegistrationEditProps) => {
    const playerRegistration: EditPlayerRegistration = {
        id: editedPlayerRegistration.id,
        birthDate: editedPlayerRegistration.birthDate,
        gender: editedPlayerRegistration.gender as "male" | "female",
        lastName: editedPlayerRegistration.lastName,
        name: editedPlayerRegistration.name,
        city: editedPlayerRegistration.city ?? "",
        country: editedPlayerRegistration.country ?? "POL",
        email: editedPlayerRegistration.email ?? "",
        icePhoneNumber: editedPlayerRegistration.icePhoneNumber,
        phoneNumber: editedPlayerRegistration.phoneNumber ?? "",
        team: editedPlayerRegistration.team,
        hasPaid: editedPlayerRegistration.hasPaid
    };
    return (
        <PlayerRegistrationForm
            onReject={onReject}
            onResolve={onResolve}
            initialPlayerRegistration={playerRegistration}
        />
    );
};
