import { InferMutationInput, trpc } from "../trpc";
import { SplitTimeForm } from "./split-time-form";

type SplitTime = InferMutationInput<"split-time.add">;

type SplitTimeCreateProps = {
    onReject: () => void;
    onResolve: (splitTime: SplitTime) => void;
    raceId: number;
    raceDate: number;
    existingTime?: number;
    existingBibNumber?: number;
};

export const SplitTimeCreate = ({
    raceDate,
    raceId,
    existingTime,
    existingBibNumber,
    onReject,
    onResolve
}: SplitTimeCreateProps) => {
    const { data: timingPoints } = trpc.useQuery(["timing-point.timingPoints", { raceId: raceId! }]);
    if (!timingPoints) return;

    const splitTime: SplitTime = {
        time: existingTime,
        raceId,
        bibNumber: existingBibNumber ?? 0,
        timingPointId: timingPoints[0]?.id ?? 0
    };

    return (
        <SplitTimeForm
            timingPoints={timingPoints}
            raceDate={raceDate}
            onReject={onReject}
            onResolve={onResolve}
            initialSplitTime={splitTime}
        />
    );
};
