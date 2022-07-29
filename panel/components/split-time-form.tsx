import Icon from "@mdi/react";
import { Button } from "./button";
import { InferMutationInput, InferQueryOutput } from "../trpc";
import { Label } from "./label";
import { mdiClose, mdiContentSaveCheck } from "@mdi/js";
import { PoorDatepicker } from "./poor-datepicker";
import { PoorFullTimepicker, PoorTimepicker } from "./poor-timepicker";
import { PoorInput } from "./poor-input";
import { PoorNumberInput } from "./poor-number-input";
import { PoorSelect } from "./poor-select";
import { useFormState } from "hooks";

type SplitTime = InferMutationInput<"split-time.update">;

type SplitTimeFormProps = {
    onReject: () => void;
    onResolve: (splitTime: SplitTime) => void;
    initialSplitTime: SplitTime;
    raceDate: number;
    timingPoints: InferQueryOutput<"timing-point.timingPoints">;
};

export const SplitTimeForm = ({
    onReject,
    onResolve,
    initialSplitTime,
    raceDate,
    timingPoints
}: SplitTimeFormProps) => {
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
                    <PoorNumberInput value={splitTime.bibNumber} onChange={changeHandler("bibNumber")} />
                </div>
                <div className="p-2"></div>
                <div className="grow">
                    <Label>Time</Label>
                    <PoorFullTimepicker date={raceDate} value={splitTime.time} onChange={changeHandler("time")} />
                </div>
            </div>
            <div className="mt-4 flex">
                <Button onClick={() => onResolve({ ...splitTime })}>
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
