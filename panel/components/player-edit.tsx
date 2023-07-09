import { trpc } from "trpc-core";
import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { PlayerForm } from "./player-form";

type Player = AppRouterOutputs["player"]["players"][0];
type EditPlayer = AppRouterInputs["player"]["edit"]["player"];

type PlayerEditProps = {
    raceId: number;
    editedPlayer: Player;
    onReject: () => void;
    onResolve: (player: EditPlayer) => void;
};

export const PlayerEdit = ({ raceId, editedPlayer, onReject, onResolve }: PlayerEditProps) => {
    const { data: classifications } = trpc.classification.classifications.useQuery({ raceId: raceId! });
    const { data: availableNumbers } = trpc.bibNumber.availableNumbers.useQuery({ raceId: raceId! });
    if (!classifications || !availableNumbers) return;

    const player: EditPlayer = {
        id: editedPlayer.id,
        birthDate: editedPlayer.birthDate,
        bibNumber: editedPlayer.bibNumber,
        startTime: editedPlayer.startTime as number,
        classificationId: editedPlayer.classificationId,
        gender: editedPlayer.gender as "male" | "female",
        lastName: editedPlayer.lastName,
        name: editedPlayer.name,
        city: editedPlayer.city,
        country: editedPlayer.country,
        email: editedPlayer.email,
        icePhoneNumber: editedPlayer.icePhoneNumber,
        phoneNumber: editedPlayer.phoneNumber,
        team: editedPlayer.team
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
