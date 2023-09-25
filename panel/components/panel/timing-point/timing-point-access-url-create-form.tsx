import { AppRouterInputs } from "trpc";
import { TimingPointAccessUrlForm } from "./timing-point-access-url-form";
import { trpc } from "trpc-core";

type CreateTimingPointAccessKey = AppRouterInputs["timingPoint"]["addTimingPointAccessUrl"];

type TimingPointCreateProps = {
    raceId: number;
    timingPointId: number;
    onReject: () => void;
    onResolve: (timingPointAccessKey: CreateTimingPointAccessKey) => void;
};

export const TimingPointAccessUrlCreate = ({ raceId, timingPointId, onReject, onResolve }: TimingPointCreateProps) => {
    const createTimingPointAccessKeyMutation = trpc.timingPoint.addTimingPointAccessUrl.useMutation();

    const timingPointAccessKey: CreateTimingPointAccessKey = {
        raceId,
        name: "",
        code: null,
        canAccessOthers: false,
        timingPointId,
    };

    const createAccessKey = async (timingPointAccessKey: CreateTimingPointAccessKey) => {
        await createTimingPointAccessKeyMutation.mutateAsync(timingPointAccessKey);
        onResolve(timingPointAccessKey);
    };

    return (
        <TimingPointAccessUrlForm
            isLoading={createTimingPointAccessKeyMutation.isLoading}
            onReject={onReject}
            onResolve={createAccessKey}
            initialTimingPointAccessUrl={timingPointAccessKey}
        />
    );
};
