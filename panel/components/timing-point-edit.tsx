import { AppRouterTypes } from "trpc";
import { TimingPointForm } from "./timing-point-form";

type TimingPoint = AppRouterTypes["timingPoint"]["timingPoints"]["output"][0];
type EditTimingPoint = AppRouterTypes["timingPoint"]["update"]["input"];

type TimingPointEditProps = {
    editedTimingPoint: TimingPoint;
    onReject: () => void;
    onResolve: (timingPoint: EditTimingPoint) => void;
};

export const TimingPointEdit = ({ editedTimingPoint, onReject, onResolve }: TimingPointEditProps) => (
    <TimingPointForm onReject={onReject} onResolve={onResolve} initialTimingPoint={editedTimingPoint} />
);
