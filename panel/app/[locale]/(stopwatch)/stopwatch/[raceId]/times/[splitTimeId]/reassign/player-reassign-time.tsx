"use client";

import { PlayersCheckIn } from "../../../../../../../../components/stopwatch/players-check-in";
import { reassign } from "@set/timer/dist/slices/split-times";
import { useTimerDispatch } from "../../../../../../../../hooks";
import { useParams, useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { timingPointIdAtom } from "states/stopwatch-states";

export const PlayerReassignTime = () => {
    const [timingPointId] = useAtom(timingPointIdAtom);
    const dispatch = useTimerDispatch();

    //eslint-disable-next-line @typescript-eslint/unbound-method
    const { back } = useRouter() as unknown as { back: () => void };

    const { splitTimeId } = useParams<{ splitTimeId: string }>()!;

    return (
        <PlayersCheckIn
            timeCritical={false}
            onPlayerCheckIn={player => {
                dispatch(reassign({ bibNumber: parseInt(player.bibNumber), lap: player.lap, id: parseInt(splitTimeId) }));
                back();
            }}
            timingPointId={timingPointId}
        />
    );
};
