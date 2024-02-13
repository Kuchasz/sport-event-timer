import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
import { TimingPointAccessUrlForm } from "./timing-point-access-url-form";
import { trpc } from "src/trpc-core";

type EditTimingPointAccessKey = AppRouterInputs["timingPoint"]["editTimingPointAccessUrl"];
type TimingPointAccessKey = AppRouterOutputs["timingPoint"]["timingPointAccessUrls"][0];

type TimingPointEditProps = {
    raceId: number;
    timingPointId: number;
    editedTimingPointAccessKey: TimingPointAccessKey;
    onReject: () => void;
    onResolve: (timingPointAccessKey: EditTimingPointAccessKey) => void;
};

export const TimingPointAccessUrlEdit = ({
    raceId,
    timingPointId,
    editedTimingPointAccessKey,
    onReject,
    onResolve,
}: TimingPointEditProps) => {
    const editTimingPointAccessKeyMutation = trpc.timingPoint.editTimingPointAccessUrl.useMutation();

    const timingPointAccessKey: EditTimingPointAccessKey = {
        id: editedTimingPointAccessKey.id,
        raceId,
        name: editedTimingPointAccessKey.name,
        code: editedTimingPointAccessKey.code,
        canAccessOthers: editedTimingPointAccessKey.canAccessOthers,
        timingPointId,
    };

    const editAccessKey = async (timingPointAccessKey: EditTimingPointAccessKey) => {
        await editTimingPointAccessKeyMutation.mutateAsync(timingPointAccessKey);
        onResolve(timingPointAccessKey);
    };

    return (
        <TimingPointAccessUrlForm
            isLoading={editTimingPointAccessKeyMutation.isLoading}
            onReject={onReject}
            onResolve={editAccessKey}
            initialTimingPointAccessUrl={timingPointAccessKey}
        />
    );
};
