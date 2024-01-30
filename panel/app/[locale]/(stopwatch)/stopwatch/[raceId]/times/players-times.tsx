"use client";

import { Transition } from "@headlessui/react";
import { mdiDeleteOutline, mdiTimerEditOutline, mdiTimerPlusOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import type { Player, TimeStamp } from "@set/timer/dist/model";
import { add, reset } from "@set/timer/dist/slices/time-stamps";
import { getIndexById, sortDesc, sort } from "@set/utils/dist/array";
import { getCurrentTime } from "@set/utils/dist/datetime";
import { useVirtualizer } from "@tanstack/react-virtual";
import classNames from "classnames";
import { useAtom } from "jotai";
import type { Route } from "next";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { timeOffsetAtom, timingPointIdAtom } from "states/stopwatch-states";
import { trpc } from "trpc-core";
import { ActionButton } from "../../../../../../components/stopwatch/action-button";
import { PlayerWithTimeStampDisplay } from "../../../../../../components/stopwatch/player-with-timestamp-display";
import { useTimerDispatch, useTimerSelector } from "../../../../../../hooks";

type TimeStampWithPlayer = TimeStamp & {
    player?: Player;
    timeStamps?: Record<number, number>;
};

const Item = <T extends string>({
    t,
    navigate,
    dispatch,
    raceId,
    style,
    padBibNumber,
    isLast,
    displayLaps,
}: {
    t: TimeStampWithPlayer;
    navigate: (path: Route<T> | URL) => void;
    dispatch: ReturnType<typeof useTimerDispatch>;
    raceId: number;
    style: CSSProperties;
    padBibNumber: number;
    isLast: boolean;
    displayLaps: boolean;
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

        const translation = dX > 15 && deleteModeEnabled.current ? dX : 0;

        targetElement.current.style.transform = `translateX(${translation}px)`;
    };

    const deleteTargetElement = (x: number) => {
        if (!targetElement.current) return;

        const dX = x - touchStartX.current;

        if (deleteModeEnabled.current && dX > 200) {
            dispatch(reset({ id: t.id }));
        } else {
            targetElement.current.style.transition = "transform";
            targetElement.current.style.transitionDuration = "0.15s";
            targetElement.current.style.transitionTimingFunction = "ease-out";
            targetElement.current.style.transform = `translateX(0px)`;
        }

        deleteModeEnabled.current = null;
    };

    return (
        <Transition appear show enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100">
            <div style={style} className="t-0 absolute left-0 w-full">
                <div
                    className={classNames("relative mx-3 flex items-center py-2", { ["border-b border-zinc-100"]: !isLast })}
                    ref={targetElement}
                    onTouchStart={e => {
                        startMoveElement(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                    }}
                    onTouchEnd={e => {
                        deleteTargetElement(e.changedTouches[0].clientX);
                    }}
                    onTouchMove={e => moveTargetElement(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}>
                    <div className="absolute -ml-[78px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-red-500 text-white">
                        <Icon size={0.8} path={mdiDeleteOutline} />
                    </div>
                    <PlayerWithTimeStampDisplay
                        playerWithTimeStamp={{
                            timeStamp: t,
                            timeStamps: t.timeStamps,
                            bibNumber: t.player?.bibNumber,
                            name: t.player?.name,
                            lastName: t.player?.lastName,
                        }}
                        padLeftBibNumber={padBibNumber}
                        displayLaps={displayLaps}
                        onAssign={() =>
                            !t.player
                                ? navigate(`/stopwatch/${raceId}/times/${t.id}/assign` as Route)
                                : navigate(`/stopwatch/${raceId}/times/${t.id}/reassign` as Route)
                        }
                    />
                    <ActionButton
                        icon={mdiTimerEditOutline}
                        onClick={() => {
                            navigate(`/stopwatch/${raceId}/times/${t.id}/tweak` as Route);
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
        </Transition>
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
    const { data: race } = trpc.race.raceInformation.useQuery({ raceId: parseInt(raceId) });
    const { data: timingPoint } = trpc.timingPoint.timingPoint.useQuery({ raceId: parseInt(raceId), timingPointId });

    const timingPointTimeStamps = sort(
        allTimeStamps.filter(s => s.timingPointId === timingPointId),
        t => t.time,
    );
    const playersTimeStamps = getIndexById(
        timingPointTimeStamps,
        s => s.bibNumber!,
        s => s.id,
    );

    const times = sortDesc(
        timingPointTimeStamps.map(s => ({
            ...s,
            timeStamps: playersTimeStamps.get(s.bibNumber!),
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
        estimateSize: () => 40 + 16,
    });

    const highestBibNumber = Math.max(...allPlayers.map(p => p.bibNumber));

    return (
        <div className="flex h-full flex-col">
            <div className="my-3 flex flex-col px-5">
                <span className="mb-2 font-semibold">{t("stopwatch.times.registerSplitTime")}</span>
                <button
                    onPointerDown={onAddTime}
                    className="active:animate-pushInLittle flex w-full flex-col items-center justify-center self-end rounded-md border-0 bg-gradient-to-b from-orange-500 to-red-500 py-8 text-center text-white shadow-md outline-none">
                    <Icon size={3} path={mdiTimerPlusOutline} />
                </button>
            </div>
            <span className="px-5 py-2 font-semibold">{t("stopwatch.times.registeredSplitTimes")}</span>
            <div ref={parentRef} className="h-full flex-grow overflow-x-hidden px-2">
                <div
                    style={{
                        height: rowVirtualizer.getTotalSize(),
                        width: "100%",
                        position: "relative",
                    }}>
                    {rowVirtualizer.getVirtualItems().map((virtualRow, index, arr) => (
                        <Item
                            style={{ transform: `translateY(${virtualRow.start}px)` }}
                            key={times[virtualRow.index].id}
                            dispatch={dispatch}
                            navigate={s => push(s as Route)}
                            t={times[virtualRow.index]}
                            raceId={parseInt(raceId)}
                            padBibNumber={highestBibNumber.toString().length}
                            isLast={index === arr.length - 1}
                            displayLaps={(timingPoint?.laps || 0) > 0}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
