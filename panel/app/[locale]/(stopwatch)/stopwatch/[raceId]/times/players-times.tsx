"use client";

import { mdiAccountAlertOutline, mdiAccountSupervisor, mdiClockPlusOutline, mdiDeleteOutline, mdiWrenchOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import type { Player, TimeStamp } from "@set/timer/dist/model";
import { add, reset } from "@set/timer/dist/slices/time-stamps";
import { sortDesc } from "@set/utils/dist/array";
import { getCurrentTime } from "@set/utils/dist/datetime";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useAtom } from "jotai";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { timeOffsetAtom, timingPointIdAtom } from "states/stopwatch-states";
import { trpc } from "trpc-core";
import { ActionButton, PrimaryActionButton } from "../../../../../../components/stopwatch/action-button";
import { PlayerWithTimeStampDisplay } from "../../../../../../components/stopwatch/player-with-timestamp-display";
import { useTimerDispatch, useTimerSelector } from "../../../../../../hooks";
import { useTranslations } from "next-intl";

type TimeStampWithPlayer = TimeStamp & {
    player?: Player;
};

const Item = <T extends string>({
    t,
    navigate,
    dispatch,
    raceId,
    style,
    padBibNumber,
}: {
    t: TimeStampWithPlayer;
    navigate: (path: Route<T> | URL) => void;
    dispatch: ReturnType<typeof useTimerDispatch>;
    raceId: number;
    style: CSSProperties;
    padBibNumber: number;
}) => {
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);
    const deleteModeEnabled = useRef<boolean | null>(null);

    const targetElement = useRef<HTMLDivElement>(null);
    const startMoveElement = (x: number, y: number) => {
        if (!targetElement.current) return;

        touchStartX.current = x;
        touchStartY.current = y;
        targetElement.current.style.transition = "none";
    };

    const moveTargetElement = (x: number, y: number) => {
        if (!targetElement.current) return;

        const dX = x - touchStartX.current;
        const dY = Math.abs(y - touchStartY.current);

        if (deleteModeEnabled.current === null) {
            if (dX > dY && dX > 1) deleteModeEnabled.current = true;
            else deleteModeEnabled.current = false;
        }

        const translation = dX > 30 && deleteModeEnabled.current ? dX : 0;

        targetElement.current.style.transform = `translateX(${translation}px)`;
    };

    const deleteTargetElement = (x: number) => {
        if (!targetElement.current) return;

        const dX = x - touchStartX.current;

        if (deleteModeEnabled.current && dX > 200) {
            dispatch(reset({ id: t.id }));
        } else {
            targetElement.current.style.transition = "transform";
            targetElement.current.style.transitionDuration = "0.2s";
            targetElement.current.style.transform = `translateX(0px)`;
        }

        deleteModeEnabled.current = null;
    };

    return (
        <div style={style} className="t-0 absolute left-0 w-full py-0.5">
            <div
                className="relative flex items-center rounded-xl bg-white px-3 py-2 shadow"
                ref={targetElement}
                onTouchStart={e => {
                    startMoveElement(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                }}
                onTouchEnd={e => {
                    deleteTargetElement(e.changedTouches[0].clientX);
                }}
                onTouchMove={e => moveTargetElement(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}>
                <div className="absolute -ml-[78px] flex h-[50px] w-[50px] items-center justify-center rounded-full bg-red-500 text-white">
                    <Icon size={0.8} path={mdiDeleteOutline} />
                </div>
                <PlayerWithTimeStampDisplay
                    playerWithTimeStamp={{
                        timeStamp: t,
                        bibNumber: t.player?.bibNumber,
                        name: t.player?.name,
                        lastName: t.player?.lastName,
                    }}
                    padBibNumber={padBibNumber}
                />
                {!t.player ? (
                    <PrimaryActionButton
                        onClick={() => {
                            navigate(`/stopwatch/${raceId}/assign/${t.id}` as Route);
                        }}
                        icon={mdiAccountAlertOutline}
                    />
                ) : (
                    <ActionButton
                        icon={mdiAccountSupervisor}
                        onClick={() => {
                            navigate(`/stopwatch/${raceId}/reassign/${t.id}` as Route);
                        }}
                    />
                )}
                <ActionButton
                    icon={mdiWrenchOutline}
                    onClick={() => {
                        navigate(`/stopwatch/${raceId}/tweak/${t.id}` as Route);
                    }}
                />
                {/* <ActionButton
                    icon={mdiDeleteOutline}
                    onClick={() => {
                        dispatch(reset({ id: t.id }));
                    }}
                /> */}
            </div>
        </div>
    );
};

export const PlayersTimes = () => {
    const [timingPointId] = useAtom(timingPointIdAtom);
    const [offset] = useAtom(timeOffsetAtom);

    const dispatch = useTimerDispatch();
    const t = useTranslations();
    //eslint-disable-next-line @typescript-eslint/unbound-method
    const { push } = useRouter();

    const allTimeStamps = useTimerSelector(x => x.timeStamps);
    const { raceId } = useParams<{ raceId: string }>()!;

    const { data: allPlayers } = trpc.player.stopwatchPlayers.useQuery({ raceId: parseInt(raceId) }, { initialData: [] });
    const { data: race } = trpc.race.basicInfo.useQuery({ raceId: parseInt(raceId) });

    const times = sortDesc(
        allTimeStamps
            .filter(s => s.timingPointId === timingPointId)
            .map(s => ({
                ...s,
                player: allPlayers.find(p => s.bibNumber === p.bibNumber),
            })),
        t => t.id,
    );

    const onAddTime = () =>
        dispatch(
            add({
                timingPointId: timingPointId,
                time: getCurrentTime(offset, race!.date),
            }),
        );

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: times.length,
        getScrollElement: () => parentRef.current!,
        estimateSize: () => 64 + 4,
    });

    const highestBibNumber = Math.max(...allPlayers.map(p => p.bibNumber));

    return (
        <div className="flex h-full flex-col">
            <div className="my-2 flex flex-col px-2">
                <button
                    onPointerDown={onAddTime}
                    className="active:animate-pushInLittle flex w-full flex-col items-center justify-center self-end rounded-md border-0 bg-gradient-to-r from-orange-500 to-red-500 py-8 text-center text-white outline-none">
                    <Icon size={3} path={mdiClockPlusOutline} />
                    <span className="mt-2 font-semibold">{t('stopwatch.times.registerSplitTime')}</span>
                </button>
            </div>
            <div ref={parentRef} className="h-full flex-grow overflow-x-hidden px-2">
                <div
                    style={{
                        height: rowVirtualizer.getTotalSize(),
                        width: "100%",
                        position: "relative",
                    }}>
                    {rowVirtualizer.getVirtualItems().map(virtualRow => (
                        <Item
                            style={{ transform: `translateY(${virtualRow.start}px)` }}
                            key={times[virtualRow.index].id}
                            dispatch={dispatch}
                            navigate={s => push(s as Route)}
                            t={times[virtualRow.index]}
                            raceId={parseInt(raceId)}
                            padBibNumber={highestBibNumber.toString().length}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
