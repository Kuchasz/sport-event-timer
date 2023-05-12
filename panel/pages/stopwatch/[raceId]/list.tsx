import { mdiAccount, mdiAccountOff } from "@mdi/js";
import { sort } from "@set/utils/dist/array";
import { add as addAbsence, reset as resetAbsence } from "@set/timer/dist/slices/absences";
import { ActionButton } from "components/stopwatch/action-button";
import { PlayerWithTimeStampDisplay } from "components/stopwatch/player-with-timestamp-display";
import { useTimerDispatch, useTimerSelector } from "hooks";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { timingPointIdAtom } from "states/stopwatch-states";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { trpc } from "connection";

const PlayersList = () => {
    const [timingPointId] = useAtom(timingPointIdAtom);

    const {
        query: { raceId },
    } = useRouter();

    const { data: allPlayers } = trpc.player.stopwatchPlayers.useQuery({ raceId: parseInt(raceId as string) }, { initialData: [] });

    const onResetAbsence = (id: number) => dispatch(resetAbsence({ id }));
    const onRecordAbsence = (bibNumber: number) =>
        dispatch(
            addAbsence({
                bibNumber,
                timingPointId: timingPointId!,
            })
        );
    const { push } = useRouter();

    const allTimeStamps = useTimerSelector(x => x.timeStamps);
    const allAbsences = useTimerSelector(x => x.absences);

    const players = sort(
        allPlayers!.map(x => ({
            ...x,
            timeStamp: allTimeStamps.find(a => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
            absent: allAbsences.find(a => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
            onReset: onResetAbsence,
            onRecord: onRecordAbsence,
            push,
        })),
        p => p.startTime || Number.MAX_VALUE
    );

    const dispatch = useTimerDispatch();

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: players.length,
        getScrollElement: () => parentRef.current!,
        estimateSize: () => 64 + 4,
    });

    const highestBibNumber = Math.max(...players.map(p => p.bibNumber));

    return (
        <div ref={parentRef} className="px-2 py-2 w-full h-full overflow-auto">
            <div
                style={{
                    height: rowVirtualizer.getTotalSize(),
                    width: "100%",
                    position: "relative",
                }}
            >
                {rowVirtualizer.getVirtualItems().map(virtualRow => (
                    <div
                        key={players[virtualRow.index].bibNumber}
                        className="absolute w-full t-0 left-0 py-0.5"
                        style={{ transform: `translateY(${virtualRow.start}px)` }}
                    >
                        <div className="flex py-2 px-3 items-center relative rounded-xl shadow bg-white">
                            <PlayerWithTimeStampDisplay
                                padBibNumber={highestBibNumber.toString().length}
                                playerWithTimeStamp={players[virtualRow.index]}
                            />
                            {!players[virtualRow.index].timeStamp && !players[virtualRow.index].absent && (
                                <ActionButton
                                    icon={mdiAccount}
                                    onClick={() => {
                                        onRecordAbsence(players[virtualRow.index].bibNumber);
                                    }}
                                />
                            )}
                            {!players[virtualRow.index].timeStamp && players[virtualRow.index].absent && (
                                <ActionButton
                                    icon={mdiAccountOff}
                                    onClick={() => {
                                        onResetAbsence(players[virtualRow.index].absent!.id);
                                    }}
                                />
                            )}
                            {/* {players[virtualRow.index].timeStamp ? (
                                <PrimaryActionButton
                                    icon={mdiAlarmOff}
                                    onClick={() => onResetTimeStamp(players[virtualRow.index].timeStamp!.id)}
                                />
                            ) : (
                                <PrimaryActionButton
                                    icon={mdiAlarmCheck}
                                    onClick={() => onRecordTimeStamp(players[virtualRow.index].bibNumber)}
                                />
                            )} */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayersList;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";
