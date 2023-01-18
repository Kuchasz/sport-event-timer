import Icon from "@mdi/react";
import { Button } from "./button";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { PoorInput } from "./poor-input";
import { useFormState } from "hooks";
import { AppRouterInputs } from "trpc";
import { PoorCheckbox } from "./poor-checkbox";

type TimingPointAccessKey = AppRouterInputs["timingPoint"]["addTimingPointAccessKey"];

type TimingPointAccessKeyProps = {
    onReject: () => void;
    onResolve: (timingPoint: TimingPointAccessKey) => void;
    initialTimingPointAccessKey: TimingPointAccessKey;
};

export const TimingPointAccessKeyForm = ({ onReject, onResolve, initialTimingPointAccessKey: initialTimingPoint }: TimingPointAccessKeyProps) => {
    const [timingPointAccessKey, changeHandler] = useFormState(initialTimingPoint, [initialTimingPoint]);
    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow">
                    <Label>Name</Label>
                    <PoorInput value={timingPointAccessKey.name} onChange={changeHandler("name")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Code</Label>
                    <PoorInput value={timingPointAccessKey.code} onChange={changeHandler("code")} />
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Can access others</Label>
                    <PoorCheckbox value={timingPointAccessKey.canAccessOthers} onChange={changeHandler("canAccessOthers")}/>
                </div>
            </div>
            <div className="mt-4 flex">
                <Button onClick={() => onResolve({ ...timingPointAccessKey })}>
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
