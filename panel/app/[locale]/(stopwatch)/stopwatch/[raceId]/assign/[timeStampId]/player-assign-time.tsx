"use client";

import { assignTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { timingPointIdAtom } from "states/stopwatch-states";
import { PlayersCheckIn } from "../../../../../../../components/stopwatch/players-check-in";
import { useTimerDispatch } from "../../../../../../../hooks";

export const PlayerAssignTime = () => {
    const [timingPointId] = useAtom(timingPointIdAtom);
    const dispatch = useTimerDispatch();

    const { back } = useRouter();

    const { timeStampId } = useParams() as { timeStampId: string };

    return (
        <PlayersCheckIn
            onPlayerCheckIn={bibNumber => {
                dispatch(assignTimeStamp({ bibNumber, id: parseInt(timeStampId) }));
                back();
            }}
            title="Assign time to player"
            timingPointId={timingPointId}
        />
    );
};
