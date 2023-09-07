import { AppRouterInputs } from "trpc";
import { TimingPointAccessUrlForm } from "./timing-point-access-url-form";

type CreateTimingPointAccessKey = AppRouterInputs["timingPoint"]["addTimingPointAccessUrl"];

type TimingPointCreateProps = {
    raceId: number;
    timingPointId: number;
    onReject: () => void;
    onResolve: (timingPointAccessKey: CreateTimingPointAccessKey) => void;
};

export const TimingPointAccessUrlCreate = ({ raceId, timingPointId, onReject, onResolve }: TimingPointCreateProps) => {
    const timingPointAccessKey: CreateTimingPointAccessKey = {
        raceId,
        name: "",
        code: null,
        canAccessOthers: false,
        timingPointId,
    };

    return <TimingPointAccessUrlForm onReject={onReject} onResolve={onResolve} initialTimingPointAccessUrl={timingPointAccessKey} />;
};
