import { AppRouterTypes } from "trpc";
import { TimingPointForm } from "./timing-point-form";

type CreateTimingPoint = AppRouterTypes["timingPoint"]["add"]["input"];

type TimingPointCreateProps = {
    raceId: number;
    onReject: () => void;
    onResolve: (timingPoint: CreateTimingPoint) => void;
};

export const TimingPointCreate = ({ raceId, onReject, onResolve }: TimingPointCreateProps) => {
    const timingPoint: CreateTimingPoint = {
        raceId,
        name: "",
        order: 0
    };

    return <TimingPointForm onReject={onReject} onResolve={onResolve} initialTimingPoint={timingPoint} />;
};
