import { trpc } from "src/trpc-core";
import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
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
    const { data: classifications } = trpc.classification.classifications.useQuery({ raceId: raceId });
    const { data: availableNumbers } = trpc.bibNumber.availableNumbers.useQuery({ raceId: raceId });
    const editPlayerMutation = trpc.player.edit.useMutation();
    if (!classifications || !availableNumbers) return;

    const player: EditPlayer = {
        id: editedPlayer.id,
        bibNumber: editedPlayer.bibNumber,
        startTime: editedPlayer.startTime!,
        classificationId: editedPlayer.classificationId,
    };

    const editPlayer = async (editedPlayer: EditPlayer) => {
        await editPlayerMutation.mutateAsync({ raceId: raceId, player: editedPlayer });
        onResolve(editedPlayer);
    };

    return (
        <PlayerForm
            isLoading={editPlayerMutation.isLoading}
            onReject={onReject}
            onResolve={editPlayer}
            classifications={classifications}
            initialPlayer={player}
            bibNumbers={availableNumbers}
        />
    );
};
