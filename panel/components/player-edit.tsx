import { InferMutationInput, InferQueryOutput, trpc } from "../trpc";
import { PlayerForm } from "./player-form";

type Player = InferQueryOutput<"player.players">[0];
type EditPlayer = InferMutationInput<"player.add">["player"];

type PlayerEditProps = {
    raceId: number;
    editedPlayer: Player;
    onReject: () => void;
    onResolve: (player: EditPlayer) => void;
};

export const PlayerEdit = ({ raceId, editedPlayer, onReject, onResolve }: PlayerEditProps) => {
    const { data: classifications } = trpc.useQuery(["classification.classifications", { raceId: raceId! }]);
    if (!classifications) return;

    const player: EditPlayer = {
        id: editedPlayer.id,
        birthDate: editedPlayer.birthDate,
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
        />
    );
};
