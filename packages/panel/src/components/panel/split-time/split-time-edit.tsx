import { trpc } from "src/trpc-core";
import type { AppRouterInputs } from "src/trpc";
import { SplitTimeForm } from "./split-time-form";

type SplitTime = AppRouterInputs["splitTime"]["update"];

type SplitTimeEditProps = {
    onReject: () => void;
    onResolve: (splitTime: SplitTime) => void;
    editedSplitTime: SplitTime;
    raceId: number;
    classificationId: number;
    raceDate: number;
};

export const SplitTimeEdit = ({ raceId, classificationId, raceDate, editedSplitTime, onReject, onResolve }: SplitTimeEditProps) => {
    const { data: splits } = trpc.split.splitsInOrder.useQuery({ raceId, classificationId });
    const { data: availableNumbers } = trpc.bibNumber.availableNumbers.useQuery({ raceId });
    const updateSplitTimeMutation = trpc.splitTime.update.useMutation();

    if (!splits || !availableNumbers) return;

    const editSplitTime = async (splitTime: SplitTime) => {
        await updateSplitTimeMutation.mutateAsync({ ...splitTime, raceId: raceId });
        onResolve(splitTime);
    };

    return (
        <SplitTimeForm
            isLoading={updateSplitTimeMutation.isLoading}
            splits={splits}
            raceDate={raceDate}
            onReject={onReject}
            onResolve={editSplitTime}
            initialSplitTime={editedSplitTime}
            bibNumbers={availableNumbers}
        />
    );
};
