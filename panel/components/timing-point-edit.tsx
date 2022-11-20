import { AppRouterInputs, AppRouterOutputs } from "trpc";
import { TimingPointForm } from "./timing-point-form";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];
type EditTimingPoint = AppRouterInputs["timingPoint"]["update"];

type TimingPointEditProps = {
    editedTimingPoint: TimingPoint;
    onReject: () => void;
    onResolve: (timingPoint: EditTimingPoint) => void;
};

export const TimingPointEdit = ({ editedTimingPoint, onReject, onResolve }: TimingPointEditProps) => (
    <TimingPointForm onReject={onReject} onResolve={onResolve} initialTimingPoint={editedTimingPoint} />
);
