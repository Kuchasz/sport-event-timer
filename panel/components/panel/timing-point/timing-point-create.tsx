import type { AppRouterInputs } from "trpc";
import { TimingPointForm } from "./timing-point-form";
import { trpc } from "trpc-core";

type CreateTimingPoint = AppRouterInputs["timingPoint"]["add"]["timingPoint"];

type TimingPointCreateProps = {
    raceId: number;
    index: number;
    onReject: () => void;
    onResolve: (timingPoint: CreateTimingPoint) => void;
};

export const TimingPointCreate = ({ raceId, index, onReject, onResolve }: TimingPointCreateProps) => {
    const addTimingPointMutation = trpc.timingPoint.add.useMutation();

    const timingPoint: CreateTimingPoint = {
        raceId,
        name: "",
        shortName: "",
        laps: 0,
    };

    const timingPointCreated = async (timingPoint: CreateTimingPoint) => {
        await addTimingPointMutation.mutateAsync({ desiredIndex: index, timingPoint });
        onResolve(timingPoint);
    };

    return (
        <TimingPointForm
            isLoading={addTimingPointMutation.isLoading}
            onReject={onReject}
            onResolve={timingPointCreated}
            initialTimingPoint={timingPoint}
        />
    );
};
