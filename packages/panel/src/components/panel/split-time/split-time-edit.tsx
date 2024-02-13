import { trpc } from "src/trpc-core";
import type { AppRouterInputs } from "src/trpc";
import { SplitTimeForm } from "./split-time-form";

type SplitTime = AppRouterInputs["splitTime"]["update"];

type SplitTimeEditProps = {
    onReject: () => void;
    onResolve: (splitTime: SplitTime) => void;
    editedSplitTime: SplitTime;
    raceId: number;
    raceDate: number;
};

export const SplitTimeEdit = ({ raceId, raceDate, editedSplitTime, onReject, onResolve }: SplitTimeEditProps) => {
    const { data: timingPoints } = trpc.timingPoint.timingPoints.useQuery({ raceId: raceId });
    const { data: availableNumbers } = trpc.bibNumber.availableNumbers.useQuery({ raceId: raceId });
    const updateSplitTimeMutation = trpc.splitTime.update.useMutation();

    if (!timingPoints || !availableNumbers) return;

    const editSplitTime = async (splitTime: SplitTime) => {
        await updateSplitTimeMutation.mutateAsync({ ...splitTime, raceId: raceId });
        onResolve(splitTime);
    };

    return (
        <SplitTimeForm
            isLoading={updateSplitTimeMutation.isLoading}
            timingPoints={timingPoints}
            raceDate={raceDate}
            onReject={onReject}
            onResolve={editSplitTime}
            initialSplitTime={editedSplitTime}
            bibNumbers={availableNumbers}
        />
    );
};
