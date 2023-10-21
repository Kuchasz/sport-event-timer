import { Button } from "./button";
import { Label } from "./label";
import { PoorFullTimepicker } from "./poor-timepicker";
import { PoorSelect } from "./poor-select";
import { useFormState } from "hooks";
import type { AppRouterInputs, AppRouterOutputs } from "trpc";
import { PoorInput } from "./poor-input";

type SplitTime = AppRouterInputs["splitTime"]["update"];

type SplitTimeFormProps = {
    onReject: () => void;
    onResolve: (splitTime: SplitTime) => void;
    initialSplitTime: SplitTime;
    raceDate: number;
    timingPoints: AppRouterOutputs["timingPoint"]["timingPoints"];
};

export const SplitTimeForm = ({ onReject, onResolve, initialSplitTime, raceDate, timingPoints }: SplitTimeFormProps) => {
    const [splitTime, changeHandler] = useFormState(initialSplitTime, [initialSplitTime]);
    return (
        <div className="flex flex-col">
            <div className="flex">
                <div className="grow">
                    <Label>Timing Point</Label>{" "}
                    {timingPoints && timingPoints.length ? (
                        <PoorSelect
                            initialValue={splitTime.timingPointId}
                            items={timingPoints}
                            nameKey="name"
                            valueKey="id"
                            onChange={changeHandler("timingPointId")}
                        ></PoorSelect>
                    ) : null}
                </div>
            </div>
            <div className="p-2"></div>
            <div className="flex">
                <div className="grow">
                    <Label>Bib Number</Label>
                    <PoorInput value={splitTime.bibNumber} onChange={changeHandler("bibNumber")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Time</Label>
                    <PoorFullTimepicker date={raceDate} value={splitTime.time} onChange={changeHandler("time")} />
                </div>
            </div>
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    Cancel
                </Button>
                <Button onClick={() => onResolve({ ...splitTime })}>Save</Button>
            </div>
        </div>
    );
};
