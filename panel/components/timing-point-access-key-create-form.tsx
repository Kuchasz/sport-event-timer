import { AppRouterInputs } from "trpc";
import { TimingPointAccessKeyForm } from "./timing-point-access-key-form";

type CreateTimingPointAccessKey = AppRouterInputs["timingPoint"]["addTimingPointAccessKey"];

type TimingPointCreateProps = {
    raceId: number;
    timingPointId: number;
    onReject: () => void;
    onResolve: (timingPointAccessKey: CreateTimingPointAccessKey) => void;
};

export const TimingPointAccessKeyCreate = ({ raceId, timingPointId, onReject, onResolve }: TimingPointCreateProps) => {
    const timingPointAccessKey: CreateTimingPointAccessKey = {
        raceId,
        name: "",
        code: null,
        canAccessOthers: false,
        timingPointId,
    };

    return <TimingPointAccessKeyForm onReject={onReject} onResolve={onResolve} initialTimingPointAccessKey={timingPointAccessKey} />;
};
