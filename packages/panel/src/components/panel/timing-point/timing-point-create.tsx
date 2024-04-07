import type { AppRouterInputs } from "src/trpc";
import { TimingPointForm } from "./timing-point-form";
import { trpc } from "src/trpc-core";

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
        abbrev: "",
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
            timingPointType="checkpoint"
        />
    );
};
