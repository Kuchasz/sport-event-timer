import { InferMutationInput, InferQueryOutput } from "../trpc";
import { TimeKeeperForm } from "./time-keeper-form";

type TimeKeeper = InferQueryOutput<"timekeeper.timeKeepers">[0];
type EditTimeKeeper = InferMutationInput<"timekeeper.update">;

type TimeKeeperEditProps = {
    editedTimeKeeper: TimeKeeper;
    onReject: () => void;
    onResolve: (timeKeeper: EditTimeKeeper) => void;
};

export const TimeKeeperEdit = ({ editedTimeKeeper, onReject, onResolve }: TimeKeeperEditProps) => (
    <TimeKeeperForm onReject={onReject} onResolve={onResolve} initialTimeKeeper={editedTimeKeeper} />
);
