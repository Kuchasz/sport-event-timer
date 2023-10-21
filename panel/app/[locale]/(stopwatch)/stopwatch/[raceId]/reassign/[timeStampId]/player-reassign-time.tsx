"use client";

import { PlayersCheckIn } from "../../../../../../../components/stopwatch/players-check-in";
import { reassignTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { useTimerDispatch } from "../../../../../../../hooks";
import { useParams, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { timingPointIdAtom } from "states/stopwatch-states";

export const PlayerReassignTime = () => {
    const [timingPointId] = useAtom(timingPointIdAtom);
    const dispatch = useTimerDispatch();

    const { back } = useRouter();

    const { timeStampId } = useParams() as { timeStampId: string };

    return (
        <PlayersCheckIn
            onPlayerCheckIn={bibNumber => {
                dispatch(reassignTimeStamp({ bibNumber, id: parseInt(timeStampId) }));
                back();
            }}
            title="Reassign time to player"
            timingPointId={timingPointId}
        />
    );
};
