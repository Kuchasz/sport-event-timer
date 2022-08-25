import { ActionButton, PrimaryActionButton } from "../../../components/stopwatch/action-button";
import { Icon } from "@mdi/react";
import { mdiAccountAlertOutline, mdiAccountSupervisor, mdiDeleteOutline, mdiPlusCircleOutline } from "@mdi/js";
import { mdiWrench } from "@mdi/js";
import { Player, TimeStamp } from "@set/timer/dist/model";
import { PlayerWithTimeStampDisplay } from "../../../components/stopwatch/player-with-timestamp-display";
import { add, reset } from "@set/timer/dist/slices/time-stamps";
import { useRef } from "react";
import { useTimerDispatch, useTimerSelector } from "../../../hooks";
import { useRouter } from "next/router";
import { getCurrentTime } from "@set/shared/dist";
import { useAtom } from "jotai";
import { timingPointIdAtom, timeOffsetAtom } from "stopwatch-states";
import { trpc } from "trpc";

type TimeStampWithPlayer = TimeStamp & {
    player?: Player;
};

const sort = (times: TimeStampWithPlayer[]) => [...times].sort((a, b) => b.time - a.time);

const Item = ({
    t,
    navigate,
    dispatch,
    raceId,
}: {
    t: TimeStampWithPlayer;
    navigate: (path: string) => void;
    dispatch: ReturnType<typeof useTimerDispatch>;
    raceId: number;
}) => {
    let touchStartX = 0;

    const targetElement = useRef<HTMLDivElement>(null);
    const targetBackground = useRef<HTMLDivElement>(null);

    const startMoveElement = (x: number) => {
        if (!targetElement.current || !targetBackground.current) return;
        touchStartX = x;
        targetElement.current.style.transition = "none";
        // targetElement.current.style.willChange = "transform";
        // targetBackground.current.style.willChange = "transform";
    };

    const moveTargetElement = (x: number) => {
        if (!targetElement.current) return;

        const dX = x - touchStartX;

        const translation = dX > 30 ? dX : 0;

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
        <div
            onTouchStart={(e) => {
                startMoveElement(e.changedTouches[0].clientX);
            }}
            onTouchEnd={(e) => {
                deleteTargetElement(e.changedTouches[0].clientX);
            }}
            onTouchMove={(e) => moveTargetElement(e.changedTouches[0].clientX)}
            className="relative bg-yellow-700 overflow-hidden"
        >
            <div ref={targetBackground} className="w-full pl-8 h-full flex items-center top-0 bg-red-500 absolute">
                <Icon size={1} path={mdiDeleteOutline} />
            </div>
            <div className="flex p-4 items-center relative bg-gray-800 z-10" ref={targetElement}>
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
                    icon={mdiWrench}
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

    const allTimeStamps = useTimerSelector((x) => x.timeStamps);
    const {
        query: { raceId },
    } = useRouter();

    const { data: allPlayers } = trpc.useQuery(["player.stopwatch-players", { raceId: parseInt(raceId as string) }], { initialData: [] });

    const times = allTimeStamps
        .filter((s) => s.timingPointId === timingPointId)
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

    const dispatch = useTimerDispatch();
    const { push } = useRouter();

    return (
        <div>
            <div className="flex flex-col my-2 px-2">
                <button
                    onClick={onAddTime}
                    className="self-end rounded-md text-center border-0 outline-none bg-gradient-to-r w-full flex justify-center from-orange-500 to-red-500 py-8"
                >
                    <Icon color="white" size={5} path={mdiPlusCircleOutline} />
                </button>
            </div>
            {sort(times).map((t) => (
                <Item key={t.time} dispatch={dispatch} navigate={push} t={t} raceId={parseInt(raceId as string)} />
            ))}
        </div>
    );
};

export default PlayersTimes;
