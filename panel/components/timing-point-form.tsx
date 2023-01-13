import Icon from "@mdi/react";
import { Button } from "./button";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { PoorInput } from "./poor-input";
import { PoorNumberInput } from "./poor-number-input";
import { useFormState } from "hooks";
import { AppRouterInputs } from "trpc";

type TimingPoint = AppRouterInputs["timingPoint"]["add"];

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
                <div className="grow">
                    <Label>Name</Label>
                    <PoorInput value={timingPoint.name} onChange={changeHandler("name")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Order</Label>
                    <PoorNumberInput value={timingPoint.order} onChange={changeHandler("order")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Description</Label>
                    <PoorInput value={timingPoint.description} onChange={changeHandler("description")} />
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
