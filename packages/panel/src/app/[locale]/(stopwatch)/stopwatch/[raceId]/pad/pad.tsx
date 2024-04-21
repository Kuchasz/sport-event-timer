"use client";

import { add } from "@set/timer/dist/slices/split-times";
import { getCurrentTime } from "@set/utils/dist/datetime";
import { useTimerDispatch } from "../../../../../../hooks";
import { PlayersCheckIn } from "src/components/stopwatch/players-check-in";
import { timingPointIdAtom, timeOffsetAtom } from "src/states/stopwatch-states";
import { useAtom } from "jotai";
import { trpc } from "src/trpc-core";
import { useParams } from "next/navigation";

export const PlayersDialPad = () => {
    const dispatch = useTimerDispatch();
    const [timingPointId] = useAtom(timingPointIdAtom);
    const [offset] = useAtom(timeOffsetAtom);
    const { raceId } = useParams<{ raceId: string }>()!;
    const { data: race } = trpc.race.raceInformation.useQuery({ raceId: parseInt(raceId) });

    return (
        <PlayersCheckIn
            timeCritical
            onPlayerCheckIn={({ bibNumber, splitId }) => {
                dispatch(
                    add({
                        bibNumber: parseInt(bibNumber),
                        splitId,
                        timingPointId,
                        time: getCurrentTime(offset, race!.date),
                    }),
                );
            }}
            timingPointId={timingPointId}
        />
    );
};
