import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
import { TimingPointForm } from "./timing-point-form";
import { trpc } from "src/trpc-core";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];
type EditTimingPoint = AppRouterInputs["timingPoint"]["update"];

type TimingPointEditProps = {
    editedTimingPoint: TimingPoint;
    onReject: () => void;
    onResolve: (timingPoint: EditTimingPoint) => void;
};

export const TimingPointEdit = ({ editedTimingPoint, onReject, onResolve }: TimingPointEditProps) => {
    const updateTimingPointMutation = trpc.timingPoint.update.useMutation();

    const timingPointEdited = async (editedTimingPoint: EditTimingPoint) => {
        await updateTimingPointMutation.mutateAsync(editedTimingPoint);
        onResolve(editedTimingPoint);
    };

    return (
        <TimingPointForm
            isLoading={updateTimingPointMutation.isLoading}
            onReject={onReject}
            onResolve={timingPointEdited}
            initialTimingPoint={editedTimingPoint}
        />
    );
};
