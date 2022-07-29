import { InferMutationInput, trpc } from "../trpc";
import { SplitTimeForm } from "./split-time-form";

type SplitTime = InferMutationInput<"split-time.update">;

type SplitTimeEditProps = {
    onReject: () => void;
    onResolve: (splitTime: SplitTime) => void;
    editedSplitTime: SplitTime;
    raceId: number;
    raceDate: number;
};

export const SplitTimeEdit = ({ raceId, raceDate, editedSplitTime, onReject, onResolve }: SplitTimeEditProps) => {
    const { data: timingPoints } = trpc.useQuery(["timing-point.timingPoints", { raceId: raceId! }]);
    if (!timingPoints) return;

    return (
        <SplitTimeForm
            timingPoints={timingPoints}
            raceDate={raceDate}
            onReject={onReject}
            onResolve={onResolve}
            initialSplitTime={editedSplitTime}
        />
    );
};
