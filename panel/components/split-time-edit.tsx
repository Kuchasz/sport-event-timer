import { trpc } from "connection";
import { AppRouterInputs } from "trpc";
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
    const { data: timingPoints } = trpc.timingPoint.timingPoints.useQuery({ raceId: raceId! });
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
