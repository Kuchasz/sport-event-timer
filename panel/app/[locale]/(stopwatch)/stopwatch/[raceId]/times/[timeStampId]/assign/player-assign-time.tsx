"use client";

import { assign } from "@set/timer/dist/slices/time-stamps";
import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { timingPointIdAtom } from "states/stopwatch-states";
import { PlayersCheckIn } from "../../../../../../../../components/stopwatch/players-check-in";
import { useTimerDispatch } from "../../../../../../../../hooks";

export const PlayerAssignTime = () => {
    const [timingPointId] = useAtom(timingPointIdAtom);
    const dispatch = useTimerDispatch();

    //eslint-disable-next-line @typescript-eslint/unbound-method
    const { back } = useRouter() as unknown as { back: () => void };

    const { timeStampId } = useParams<{ timeStampId: string }>()!;

    return (
        <PlayersCheckIn
            timeCritical={false}
            onPlayerCheckIn={bibNumber => {
                dispatch(assign({ bibNumber: parseInt(bibNumber), id: parseInt(timeStampId) }));
                back();
            }}
            timingPointId={timingPointId}
        />
    );
};
