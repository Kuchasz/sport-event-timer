import { AppRouterInputs } from "trpc";
import { PlayerRegistrationForm } from "./player-registration-form";

type CreatePlayerRegistration = AppRouterInputs["playerRegistration"]["add"]["player"];

type PlayerRegistrationCreateProps = {
    onReject: () => void;
    onResolve: (player: CreatePlayerRegistration) => void;
};

export const PlayerRegistrationCreate = ({ onReject, onResolve }: PlayerRegistrationCreateProps) => {
    const playerRegistration: CreatePlayerRegistration = {
        name: undefined as unknown as string,
        lastName: undefined as unknown as string,
        gender: "male",
        birthDate: new Date(1990, 0, 1),
        city: "",
        email: "",
        phoneNumber: "",
        country: "POL",
        hasPaid: false
    };

    return (
        <PlayerRegistrationForm
            onReject={onReject}
            onResolve={onResolve}
            initialPlayerRegistration={playerRegistration}
        />
    );
};
