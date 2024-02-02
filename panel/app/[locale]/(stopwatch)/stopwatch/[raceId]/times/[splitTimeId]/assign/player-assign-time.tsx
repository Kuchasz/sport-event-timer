"use client";

import { assign } from "@set/timer/dist/slices/split-times";
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

    const { splitTimeId } = useParams<{ splitTimeId: string }>()!;

    return (
        <PlayersCheckIn
            timeCritical={false}
            onPlayerCheckIn={player => {
                dispatch(assign({ bibNumber: parseInt(player.bibNumber), lap: player.lap, id: parseInt(splitTimeId) }));
                back();
            }}
            timingPointId={timingPointId}
        />
    );
};
