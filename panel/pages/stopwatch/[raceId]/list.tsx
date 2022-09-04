import { mdiAlarmCheck, mdiAlarmOff, mdiWrenchOutline } from "@mdi/js";
import { getCurrentTime, sort } from "@set/shared/dist";
import { add, reset } from "@set/timer/dist/slices/time-stamps";
import { PrimaryActionButton, ActionButton } from "components/stopwatch/action-button";
import { PlayerWithTimeStampDisplay } from "components/stopwatch/player-with-timestamp-display";
import { useTimerDispatch, useTimerSelector } from "hooks";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { timingPointIdAtom, timeOffsetAtom } from "stopwatch-states";
import { trpc } from "trpc";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const PlayersList = () => {
    const [timingPointId] = useAtom(timingPointIdAtom);
    const [offset] = useAtom(timeOffsetAtom);

    const {
        query: { raceId },
    } = useRouter();

    const { data: allPlayers } = trpc.useQuery(["player.stopwatch-players", { raceId: parseInt(raceId as string) }], { initialData: [] });

    const onReset = (id: number) => dispatch(reset({ id }));
    const onRecord = (bibNumber: number) =>
        dispatch(
            add({
                bibNumber,
                timingPointId: timingPointId!,
                time: getCurrentTime(offset!),
            })
        );
    const { push } = useRouter();

    const allTimeStamps = useTimerSelector((x) => x.timeStamps);

    const players2 = sort(
        allPlayers!.map((x) => ({
            ...x,
            timeStamp: allTimeStamps.find((a) => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
            onReset,
            onRecord,
            push,
        })),
        (p) => p.startTime || Number.MAX_VALUE
    );
    const players = [...players2, ...players2, ...players2, ...players2, ...players2, ...players2];
    const dispatch = useTimerDispatch();

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: players.length,
        getScrollElement: () => parentRef.current!,
        estimateSize: () => 125,
    });

    return (
        <div ref={parentRef} className="px-2"   style={{
            height: `100%`,
            width: `100%`,
            overflow: 'auto',
          }}>
            <div
                style={{
                    height: rowVirtualizer.getTotalSize(),
                    width: "100%",
                    position: "relative",
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                    <div
                        key={virtualRow.index}
                        ref={virtualRow.measureElement}
                        className={virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                    >
                        <div
                            key={players[virtualRow.index].bibNumber}
                            className="my-1 py-2 px-3 rounded-xl shadow bg-white flex items-center"
                        >
                            <PlayerWithTimeStampDisplay playerWithTimeStamp={players[virtualRow.index]} />
                            {players[virtualRow.index].timeStamp && (
                                <ActionButton
                                    icon={mdiWrenchOutline}
                                    onClick={() => {
                                        push(`/stopwatch/${raceId}/tweak/${players[virtualRow.index].timeStamp?.id}`);
                                    }}
                                />
                            )}
                            {players[virtualRow.index].timeStamp ? (
                                <PrimaryActionButton icon={mdiAlarmOff} onClick={() => onReset(players[virtualRow.index].timeStamp!.id)} />
                            ) : (
                                <PrimaryActionButton icon={mdiAlarmCheck} onClick={() => onRecord(players[virtualRow.index].bibNumber)} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayersList;
