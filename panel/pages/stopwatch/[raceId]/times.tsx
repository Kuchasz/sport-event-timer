import { ActionButton, PrimaryActionButton } from "../../../components/stopwatch/action-button";
import { Icon } from "@mdi/react";
import { mdiAccountAlertOutline, mdiAccountSupervisor, mdiDeleteOutline, mdiPlus, mdiWrenchOutline } from "@mdi/js";
import { Player, TimeStamp } from "@set/timer/dist/model";
import { PlayerWithTimeStampDisplay } from "../../../components/stopwatch/player-with-timestamp-display";
import { add, reset } from "@set/timer/dist/slices/time-stamps";
import { CSSProperties, useRef } from "react";
import { useTimerDispatch, useTimerSelector } from "../../../hooks";
import { useRouter } from "next/router";
import { sortDesc } from "@set/utils/dist/array";
import { getCurrentTime } from "@set/utils/dist/datetime";
import { useAtom } from "jotai";
import { timingPointIdAtom, timeOffsetAtom } from "states/stopwatch-states";

import { useVirtualizer } from "@tanstack/react-virtual";
import { trpc } from "connection";

type TimeStampWithPlayer = TimeStamp & {
    player?: Player;
};

const Item = ({
    t,
    navigate,
    dispatch,
    raceId,
    style,
    padBibNumber
}: {
    t: TimeStampWithPlayer;
    navigate: (path: string) => void;
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
        <div style={style} className="absolute w-full t-0 left-0 py-0.5">
            <div
                className="flex py-2 px-3 items-center relative rounded-xl shadow bg-white"
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
                        lastName: t.player?.lastName
                    }}
                    padBibNumber={padBibNumber}
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
        </div>
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

    const { data: allPlayers } = trpc.player.stopwatchPlayers.useQuery({ raceId: parseInt(raceId as string) }, { initialData: [] });
    const { data: race } = trpc.race.basicInfo.useQuery({ raceId: parseInt(raceId as string) });

    const times = sortDesc(
        allTimeStamps
            .filter((s) => s.timingPointId === timingPointId)
            .map((s) => ({
                ...s,
                player: allPlayers!.find((p) => s.bibNumber === p.bibNumber),
            })),
        (t) => t.id
    );

    const onAddTime = () =>
        dispatch(
            add({
                timingPointId: timingPointId!,
                time: getCurrentTime(offset!, race!.date),
            })
        );

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: times.length,
        getScrollElement: () => parentRef.current!,
        estimateSize: () => 64 + 4,
    });

    const highestBibNumber = Math.max(...allPlayers.map(p => p.bibNumber));

    return (
        <div className="h-full flex flex-col">
            <div className="flex my-2 flex-col px-2">
                <button
                    onClick={onAddTime}
                    className="active:animate-pushInLittle self-end rounded-md text-center border-0 outline-none bg-gradient-to-r w-full flex justify-center from-orange-500 to-red-500 py-8"
                >
                    <Icon color="white" size={5} path={mdiPlus} />
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
                            dispatch={dispatch}
                            navigate={push}
                            t={times[virtualRow.index]}
                            raceId={parseInt(raceId as string)}
                            padBibNumber={highestBibNumber.toString().length}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlayersTimes;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";