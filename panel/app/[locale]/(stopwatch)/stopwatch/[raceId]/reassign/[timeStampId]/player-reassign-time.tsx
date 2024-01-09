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

    //eslint-disable-next-line @typescript-eslint/unbound-method
    const { back } = useRouter() as unknown as { back: () => void };

    const { timeStampId } = useParams<{ timeStampId: string }>()!;

    return (
        <PlayersCheckIn
            onPlayerCheckIn={bibNumber => {
                dispatch(reassignTimeStamp({ bibNumber: parseInt(bibNumber), id: parseInt(timeStampId) }));
                back();
            }}
            timingPointId={timingPointId}
        />
    );
};
