import { TimeKeeper } from "../model";

export const fakeTimeKeepers = [
    {
        id: 0,
        name: "Start",
        type: "start"
    },
    {
        id: 1,
        name: "Checkpoint I",
        type: "checkpoint"
    },
    {
        id: 2,
        name: "Checkpoint II",
        type: "checkpoint"
    },
    {
        id: 3,
        name: "Finish",
        type: "end"
    }
] as TimeKeeper[];
