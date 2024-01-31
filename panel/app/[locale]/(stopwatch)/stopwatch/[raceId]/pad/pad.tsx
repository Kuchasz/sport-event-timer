"use client";

import { add } from "@set/timer/dist/slices/split-times";
import { getCurrentTime } from "@set/utils/dist/datetime";
import { useTimerDispatch } from "../../../../../../hooks";
import { PlayersCheckIn } from "components/stopwatch/players-check-in";
import { timingPointIdAtom, timeOffsetAtom } from "states/stopwatch-states";
import { useAtom } from "jotai";
import { trpc } from "trpc-core";
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
            onPlayerCheckIn={bibNumber => {
                dispatch(
                    add({
                        bibNumber: parseInt(bibNumber),
                        timingPointId,
                        time: getCurrentTime(offset, race!.date),
                    }),
                );
            }}
            timingPointId={timingPointId}
        />
    );
};
