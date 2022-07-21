import { InferMutationInput, InferQueryOutput } from "../trpc";
import { TimingPointForm } from "./timing-point-form";

type TimingPoint = InferQueryOutput<"timing-point.timingPoints">[0];
type EditTimingPoint = InferMutationInput<"timing-point.update">;

type TimingPointEditProps = {
    editedTimingPoint: TimingPoint;
    onReject: () => void;
    onResolve: (timingPoint: EditTimingPoint) => void;
};

export const TimingPointEdit = ({ editedTimingPoint, onReject, onResolve }: TimingPointEditProps) => (
    <TimingPointForm onReject={onReject} onResolve={onResolve} initialTimingPoint={editedTimingPoint} />
);
