import { InferMutationInput } from "../trpc";
import { TimeKeeperForm } from "./time-keeper-form";

type CreateTimeKeeper = InferMutationInput<"timekeeper.add">;

type TimeKeeperCreateProps = {
    raceId: number;
    onReject: () => void;
    onResolve: (timeKepper: CreateTimeKeeper) => void;
};

export const TimeKeeperCreate = ({ raceId, onReject, onResolve }: TimeKeeperCreateProps) => {
    const timeKeeper: CreateTimeKeeper = {
        raceId,
        name: "",
        order: 0
    };

    return <TimeKeeperForm onReject={onReject} onResolve={onResolve} initialTimeKeeper={timeKeeper} />;
};
