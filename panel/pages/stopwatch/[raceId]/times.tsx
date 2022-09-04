import { ActionButton, PrimaryActionButton } from "../../../components/stopwatch/action-button";
import { Icon } from "@mdi/react";
import { mdiAccountAlertOutline, mdiAccountSupervisor, mdiDeleteOutline, mdiPlusCircleOutline, mdiWrenchOutline } from "@mdi/js";
import { Player, TimeStamp } from "@set/timer/dist/model";
import { PlayerWithTimeStampDisplay } from "../../../components/stopwatch/player-with-timestamp-display";
import { add, reset } from "@set/timer/dist/slices/time-stamps";
import { CSSProperties, LegacyRef, useRef } from "react";
import { useTimerDispatch, useTimerSelector } from "../../../hooks";
import { useRouter } from "next/router";
import { getCurrentTime } from "@set/shared/dist";
import { useAtom } from "jotai";
import { timingPointIdAtom, timeOffsetAtom } from "stopwatch-states";
import { trpc } from "trpc";
import { Transition } from "@headlessui/react";

import { useVirtualizer } from "@tanstack/react-virtual";

type TimeStampWithPlayer = TimeStamp & {
    player?: Player;
};

// const sort = (times: TimeStampWithPlayer[]) => [...times].sort((a, b) => b.time - a.time);

const Item = ({
    t,
    navigate,
    dispatch,
    raceId,
    style,
    ref,
}: {
    t: TimeStampWithPlayer;
    navigate: (path: string) => void;
    dispatch: ReturnType<typeof useTimerDispatch>;
    raceId: number;
    style: CSSProperties;
    ref: LegacyRef<HTMLDivElement>;
}) => {
    let touchStartX = 0;
    let touchStartY = 0;

    const targetElement = useRef<HTMLDivElement>(null);
    const startMoveElement = (x: number, y: number) => {
        if (!targetElement.current) return;
        touchStartX = x;
        touchStartY = y;
        targetElement.current.style.transition = "none";
    };

    const moveTargetElement = (x: number, y: number) => {
        if (!targetElement.current) return;

        const dX = x - touchStartX;
        const dY = y - touchStartY;

        const translation = dX > 30 && dY < 5 ? dX : 0;

        targetElement.current.style.transform = `translateX(${translation}px)`;
    };

    const deleteTargetElement = (x: number) => {
        if (!targetElement.current) return;

        const dX = x - touchStartX;

        if (dX > 200) {
            dispatch(reset({ id: t.id }));
        } else {
            targetElement.current.style.transition = "transform";
            targetElement.current.style.transitionDuration = "0.2s";
            targetElement.current.style.transform = `translateX(0px)`;
        }
    };

    return (
        <Transition
            appear={true}
            style={style}
            show={true}
            ref={ref}
            className="absolute w-full t-0 left-0"
            enter="transition-all duration-500"
            enterFrom="opacity-0 translate-x-10"
            enterTo="opacity-100 translate-x-0"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div
                className="flex mt-1 py-2 px-3 items-center relative rounded-xl shadow bg-white"
                ref={targetElement}
                onTouchStart={(e) => {
                    startMoveElement(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                }}
                onTouchEnd={(e) => {
                    deleteTargetElement(e.changedTouches[0].clientX);
                }}
                onTouchMove={(e) => moveTargetElement(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
            >
                <div className="rounded-full w-[50px] h-[50px] flex justify-center items-center bg-red-500 text-white absolute -ml-[78px]">
                        <Icon size={1} path={mdiDeleteOutline} />
                    </div>
                <PlayerWithTimeStampDisplay
                    playerWithTimeStamp={{
                        timeStamp: t,
                        bibNumber: t.player?.bibNumber,
                        name: t.player?.name,
                        lastName: t.player?.lastName,
                    }}
                />
                {!t.player ? (
                    <PrimaryActionButton
                        onClick={() => {
                            navigate(`/stopwatch/${raceId}/assign/${t.id}`);
                        }}
                        icon={mdiAccountAlertOutline}
                    />
                ) : (
                    <ActionButton
                        icon={mdiAccountSupervisor}
                        onClick={() => {
                            navigate(`/stopwatch/${raceId}/reassign/${t.id}`);
                        }}
                    />
                )}
                <ActionButton
                    icon={mdiWrenchOutline}
                    onClick={() => {
                        navigate(`/stopwatch/${raceId}/tweak/${t.id}`);
                    }}
                />
                {/* <ActionButton
                    icon={mdiDeleteOutline}
                    onClick={() => {
                        dispatch(reset({ id: t.id }));
                    }}
                /> */}
            </div>
        </Transition>
    );
};

const PlayersTimes = () => {
    const [timingPointId] = useAtom(timingPointIdAtom);
    const [offset] = useAtom(timeOffsetAtom);

    const dispatch = useTimerDispatch();
    const { push } = useRouter();

    const allTimeStamps = useTimerSelector((x) => x.timeStamps);
    const {
        query: { raceId },
    } = useRouter();

    const { data: allPlayers } = trpc.useQuery(["player.stopwatch-players", { raceId: parseInt(raceId as string) }], { initialData: [] });

    const times = allTimeStamps
        //.filter((s) => s.timingPointId === timingPointId)
        .map((s) => ({
            ...s,
            player: allPlayers!.find((p) => s.bibNumber === p.bibNumber),
        }));

    const onAddTime = () =>
        dispatch(
            add({
                timingPointId: timingPointId!,
                time: getCurrentTime(offset!),
            })
        );

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: times.length,
        getScrollElement: () => parentRef.current!,
        estimateSize: () => 68,
    });

    console.log("render times!");

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col my-2 px-2">
                <button
                    onClick={onAddTime}
                    className="self-end rounded-md text-center border-0 outline-none bg-gradient-to-r w-full flex justify-center from-orange-500 to-red-500 py-8"
                >
                    <Icon color="white" size={5} path={mdiPlusCircleOutline} />
                </button>
            </div>
            <div ref={parentRef} className="px-2 flex-grow h-full overflow-x-hidden">
                <div
                    style={{
                        height: rowVirtualizer.getTotalSize(),
                        width: "100%",
                        position: "relative",
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                        <Item
                            style={{ transform: `translateY(${virtualRow.start}px)` }}
                            key={times[virtualRow.index].id}
                            ref={virtualRow.measureElement}
                            dispatch={dispatch}
                            navigate={push}
                            t={times[virtualRow.index]}
                            raceId={parseInt(raceId as string)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlayersTimes;
