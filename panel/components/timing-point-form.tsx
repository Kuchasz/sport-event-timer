import Icon from "@mdi/react";
import { Button } from "./button";
import { InferMutationInput } from "../trpc";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { PoorInput } from "./poor-input";
import { PoorNumberInput } from "./poor-number-input";
import { useFormState } from "hooks";

type TimingPoint = InferMutationInput<"timing-point.add">;

type TimingPointFormProps = {
    onReject: () => void;
    onResolve: (timingPoint: TimingPoint) => void;
    initialTimingPoint: TimingPoint;
};

export const TimingPointForm = ({ onReject, onResolve, initialTimingPoint }: TimingPointFormProps) => {
    const [timingPoint, changeHandler] = useFormState(initialTimingPoint, [initialTimingPoint]);
    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="form-control grow">
                    <label className="label">
                        <span className="label-text">Name</span>
                        <span className="label-text-alt">Required</span>
                    </label>
                    <PoorInput value={timingPoint.name} onChange={changeHandler("name")} />
                </div>
                <div className="p-2"></div>
                <div className="form-control grow">
                    <label className="label">
                        <span className="label-text">Order</span>
                        <span className="label-text-alt">Required</span>
                    </label>
                    <PoorNumberInput value={timingPoint.order} onChange={changeHandler("order")} />
                </div>
            </div>
            <div className="mt-4 flex">
                <Button onClick={() => onResolve({ ...timingPoint })}>
                    <Icon size={1} path={mdiContentSaveCheck} />
                    <span className="ml-2">Save</span>
                </Button>
                <Button onClick={onReject} className="ml-2">
                    <Icon size={1} path={mdiClose} />
                    <span className="ml-2">Cancel</span>
                </Button>
            </div>
        </div>
    );
};
