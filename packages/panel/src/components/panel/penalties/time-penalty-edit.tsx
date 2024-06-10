import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
import { TimePenaltyForm } from "./time-penalty-form";
import { trpc } from "src/trpc-core";
import { useCurrentRaceId } from "src/hooks";

type TimePenalty = AppRouterOutputs["timePenalty"]["allPenalties"][0];
type UpdateTimePenalty = AppRouterInputs["timePenalty"]["update"];

type TimePenaltyEditProps = {
    editedTimePenalty: TimePenalty;
    onReject: () => void;
    onResolve: (TimePenalty: UpdateTimePenalty) => void;
};

export const TimePenaltyEdit = ({ editedTimePenalty, onReject, onResolve }: TimePenaltyEditProps) => {
    const updateTimePenaltyMutation = trpc.timePenalty.update.useMutation();
    const raceId = useCurrentRaceId();
    const { data: bibNumbers } = trpc.bibNumber.playersNumbers.useQuery({ raceId }, { initialData: [] });

    const timePenalty: UpdateTimePenalty = {
        id: editedTimePenalty.id,
        bibNumber: editedTimePenalty.bibNumber,
        raceId: editedTimePenalty.raceId,
        reason: editedTimePenalty.reason,
        time: editedTimePenalty.time,
    };

    const processTimePenaltyEdit = async (editedTimePenalty: UpdateTimePenalty) => {
        await updateTimePenaltyMutation.mutateAsync({ ...editedTimePenalty });
        onResolve(editedTimePenalty);
    };

    return (
        <TimePenaltyForm
            isLoading={updateTimePenaltyMutation.isPending}
            onReject={onReject}
            onResolve={processTimePenaltyEdit}
            initialTimePenalty={timePenalty}
            bibNumbers={bibNumbers}
        />
    );
};
