import Icon from "@mdi/react";
import { Button } from "./button";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { PoorInput } from "./poor-input";
import { useFormState } from "hooks";
import { AppRouterInputs } from "trpc";

type TimingPoint = AppRouterInputs["timingPoint"]["update"];

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
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Description</Label>
                    <PoorInput value={timingPoint.description} onChange={changeHandler("description")} />
                </div>
            </div>
            <div className="mt-4 justify-between flex">
                <Button onClick={onReject} outline>
                    <Icon size={1} path={mdiClose} />
                    <span className="ml-2">Cancel</span>
                </Button>
                <Button onClick={() => onResolve({ ...timingPoint })}>
                    <Icon size={1} path={mdiContentSaveCheck} />
                    <span className="ml-2">Save</span>
                </Button>
            </div>
        </div>
    );
};
