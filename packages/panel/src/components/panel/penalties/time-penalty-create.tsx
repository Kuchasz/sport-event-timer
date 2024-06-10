import type { AppRouterInputs } from "src/trpc";
import { TimePenaltyForm } from "./time-penalty-form";
import { trpc } from "src/trpc-core";
import { useCurrentRaceId } from "src/hooks";

type CreateTimePenalty = AppRouterInputs["timePenalty"]["applyPenalty"];

type TimePenaltyCreateProps = {
    onReject: () => void;
    onResolve: (timePenalty: CreateTimePenalty) => void;
};

export const TimePenaltyCreate = ({ onReject, onResolve }: TimePenaltyCreateProps) => {
    const addTimePenaltyMutation = trpc.timePenalty.applyPenalty.useMutation();

    const raceId = useCurrentRaceId();
    const { data: bibNumbers } = trpc.bibNumber.nonDisqualifiedPlayerNumbers.useQuery({ raceId }, { initialData: [] });

    const timePenalty: CreateTimePenalty = {
        raceId,
        bibNumber: "",
        reason: "",
        time: 0,
    };

    const processTimePenaltyCreate = async (TimePenalty: CreateTimePenalty) => {
        await addTimePenaltyMutation.mutateAsync({ ...TimePenalty });
        onResolve(TimePenalty);
    };

    return (
        <TimePenaltyForm
            isLoading={addTimePenaltyMutation.isPending}
            onReject={onReject}
            onResolve={processTimePenaltyCreate}
            initialTimePenalty={timePenalty}
            bibNumbers={bibNumbers}
        />
    );
};
