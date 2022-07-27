import { ActionButton, PrimaryActionButton } from "./action-button";
import { Icon } from "@mdi/react";
import {
    mdiAccountAlertOutline,
    mdiAccountSupervisor,
    mdiDeleteOutline,
    mdiPlusCircleOutline
    } from "@mdi/js";
import { mdiWrench } from "@mdi/js";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Player, TimeStamp } from "@set/timer/dist/model";
import { PlayerWithTimeStampDisplay } from "./player-with-timestamp-display";
import { reset } from "@set/timer/dist/slices/time-stamps";
import { useRef } from "react";
import { useTimerDispatch } from "../hooks";

type TimeStampWithPlayer = TimeStamp & {
    player?: Player;
};

type PlayersTimesProps = {
    times: TimeStampWithPlayer[];
    onAddTime: () => void;
    timeKeeperId?: number;
};

const sort = (times: TimeStampWithPlayer[]) => [...times].sort((a, b) => b.time - a.time);

const Item = ({
    t,
    navigate,
    dispatch
}: {
    t: TimeStampWithPlayer;
    navigate: NavigateFunction;
    dispatch: ReturnType<typeof useTimerDispatch>;
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

        const translation = dX > 10 ? dX : 0;

        targetElement.current.style.transform = `translateX(${translation}px)`;
    };

    const deleteTargetElement = (x: number) => {
        if (!targetElement.current) return;

        const dX = x - touchStartX;

        if (dX > 150) {
            dispatch(reset({ id: t.id }));
        } else {
            targetElement.current.style.transition = "transform";
            targetElement.current.style.transitionDuration = "0.2s";
            targetElement.current.style.transform = `translateX(0px)`;
        }
    };

    return (
        <div
            onTouchStart={e => {
                startMoveElement(e.changedTouches[0].clientX);
            }}
            onTouchEnd={e => {
                deleteTargetElement(e.changedTouches[0].clientX);
            }}
            onTouchMove={e => moveTargetElement(e.changedTouches[0].clientX)}
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
                        lastName: t.player?.lastName
                    }}
                />
                {!t.player ? (
                    <PrimaryActionButton
                        onClick={() => {
                            navigate(`${process.env.PUBLIC_URL}/assign/${t.id}`);
                        }}
                        icon={mdiAccountAlertOutline}
                    />
                ) : (
                    <ActionButton
                        icon={mdiAccountSupervisor}
                        onClick={() => {
                            navigate(`${process.env.PUBLIC_URL}/reassign/${t.id}`);
                        }}
                    />
                )}
                <ActionButton
                    icon={mdiWrench}
                    onClick={() => {
                        navigate(`${process.env.PUBLIC_URL}/tweak/${t.id}`);
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

export const PlayersTimes = ({ times, onAddTime }: PlayersTimesProps) => {
    const dispatch = useTimerDispatch();
    const navigate = useNavigate();

    return (
        <div>
            <div className="flex flex-col mt-2">
                <button
                    onClick={onAddTime}
                    className="self-end rounded-md text-center bg-gradient-to-r w-20 flex justify-center from-orange-500 to-red-500 py-2 px-4"
                >
                    <Icon color="white" size={1} path={mdiPlusCircleOutline} />
                </button>
            </div>
            {sort(times).map(t => (
                <Item key={t.id} dispatch={dispatch} navigate={navigate} t={t} />
            ))}
        </div>
    );
};
