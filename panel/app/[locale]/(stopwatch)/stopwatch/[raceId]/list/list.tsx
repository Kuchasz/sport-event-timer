"use client";

import { mdiAccount, mdiAccountOff } from "@mdi/js";
import { sort } from "@set/utils/dist/array";
import { add as addAbsence, reset as resetAbsence } from "@set/timer/dist/slices/absences";
import { ActionButton } from "components/stopwatch/action-button";
import { PlayerWithTimeStampDisplay } from "components/stopwatch/player-with-timestamp-display";
import { useTimerDispatch, useTimerSelector } from "hooks";
import { useAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { timingPointIdAtom } from "states/stopwatch-states";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
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

    const allTimeStamps = useTimerSelector(x => x.timeStamps);
    const allAbsences = useTimerSelector(x => x.absences);

    const players = sort(
        allPlayers.map(x => ({
            ...x,
            timeStamps: allTimeStamps.filter(a => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
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

    const allowAbsences = timingPoint?.isFinish || timingPoint?.isStart;

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
                            <PlayerWithTimeStampDisplay
                                padLeftBibNumber={highestBibNumber.toString().length}
                                playerWithTimeStamp={players[virtualRow.index]}
                                displayLaps={(timingPoint?.laps || 0) > 0}
                            />
                            {allowAbsences && !players[virtualRow.index].timeStamps.length && !players[virtualRow.index].absent && (
                                <ActionButton
                                    icon={mdiAccount}
                                    onClick={() => {
                                        onRecordAbsence(players[virtualRow.index].bibNumber);
                                    }}
                                />
                            )}
                            {allowAbsences && !players[virtualRow.index].timeStamps.length && players[virtualRow.index].absent && (
                                <ActionButton
                                    icon={mdiAccountOff}
                                    onClick={() => {
                                        onResetAbsence(players[virtualRow.index].absent!.id);
                                    }}
                                    alert={true}
                                />
                            )}

                            {/* {players[virtualRow.index].timeStamp ? (
                                <PrimaryActionButton
                                    icon={mdiAlarmOff}
                                    onMouseDown={() => onResetTimeStamp(players[virtualRow.index].timeStamp!.id)}
                                />
                            ) : (
                                <PrimaryActionButton
                                    icon={mdiAlarmCheck}
                                    onMouseDown={() => onRecordTimeStamp(players[virtualRow.index].bibNumber)}
                                />
                            )} */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
