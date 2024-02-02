"use client";

import { mdiAccount, mdiAccountOff } from "@mdi/js";
import { add as addAbsence, reset as resetAbsence } from "@set/timer/dist/slices/absences";
import { sort } from "@set/utils/dist/array";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ActionButton } from "components/stopwatch/action-button";
import { PlayerWithSplitTimeDisplay } from "components/stopwatch/player-with-split-time-display";
import { useTimerDispatch, useTimerSelector } from "hooks";
import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { timingPointIdAtom } from "states/stopwatch-states";
import { trpc } from "trpc-core";

export const PlayersList = () => {
    const [timingPointId] = useAtom(timingPointIdAtom);

    const { raceId } = useParams<{ raceId: string }>()!;

    const { data: allPlayers } = trpc.player.stopwatchPlayers.useQuery({ raceId: parseInt(raceId) }, { initialData: [] });
    const { data: timingPoint } = trpc.timingPoint.timingPoint.useQuery({ raceId: parseInt(raceId), timingPointId });

    const onResetAbsence = (id: number) => dispatch(resetAbsence({ id }));
    const onRecordAbsence = (bibNumber: number) =>
        dispatch(
            addAbsence({
                bibNumber,
                timingPointId: timingPointId,
            }),
        );

    //eslint-disable-next-line @typescript-eslint/unbound-method
    const { push } = useRouter();

    const allSplitTimes = useTimerSelector(x => x.splitTimes);
    const allAbsences = useTimerSelector(x => x.absences);

    const players = sort(
        allPlayers.map(x => ({
            ...x,
            splitTime: sort(
                allSplitTimes.filter(a => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
                t => t.lap!,
            ).at(-1),
            absent: allAbsences.find(a => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
            onReset: onResetAbsence,
            onRecord: onRecordAbsence,
            push,
        })),
        p => p.startTime || Number.MAX_VALUE,
    );

    const dispatch = useTimerDispatch();

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: players.length,
        getScrollElement: () => parentRef.current!,
        estimateSize: () => 64 + 4,
    });

    const highestBibNumber = Math.max(...players.map(p => p.bibNumber));

    const allowAbsences = timingPoint?.type === "start" || timingPoint?.type === "finish";

    return (
        <div ref={parentRef} className="h-full w-full overflow-auto px-2 py-2">
            <div
                style={{
                    height: rowVirtualizer.getTotalSize(),
                    width: "100%",
                    position: "relative",
                }}>
                {rowVirtualizer.getVirtualItems().map(virtualRow => (
                    <div
                        key={players[virtualRow.index].bibNumber}
                        className="t-0 absolute left-0 w-full py-0.5"
                        style={{ transform: `translateY(${virtualRow.start}px)` }}>
                        <div className="relative flex items-center rounded-xl bg-white px-3 py-2 shadow">
                            <PlayerWithSplitTimeDisplay
                                padLeftBibNumber={highestBibNumber.toString().length}
                                playerWithSplitTime={players[virtualRow.index]}
                                displayLaps={(timingPoint?.laps || 0) > 0}
                            />
                            {allowAbsences && !players[virtualRow.index].splitTime && !players[virtualRow.index].absent && (
                                <ActionButton
                                    icon={mdiAccount}
                                    onClick={() => {
                                        onRecordAbsence(players[virtualRow.index].bibNumber);
                                    }}
                                />
                            )}
                            {allowAbsences && !players[virtualRow.index].splitTime && players[virtualRow.index].absent && (
                                <ActionButton
                                    icon={mdiAccountOff}
                                    onClick={() => {
                                        onResetAbsence(players[virtualRow.index].absent!.id);
                                    }}
                                    alert={true}
                                />
                            )}

                            {/* {players[virtualRow.index].splitTime ? (
                                <PrimaryActionButton
                                    icon={mdiAlarmOff}
                                    onMouseDown={() => onResetSplitTime(players[virtualRow.index].splitTime!.id)}
                                />
                            ) : (
                                <PrimaryActionButton
                                    icon={mdiAlarmCheck}
                                    onMouseDown={() => onRecordSplitTime(players[virtualRow.index].bibNumber)}
                                />
                            )} */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
