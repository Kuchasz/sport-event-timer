import usePortal from "react-useportal";
import { ActionButton, PrimaryActionButton } from "./action-button";
import { assignPlayer, reset } from "@set/timer/slices/time-stamps";
import { formatNumber } from "../utils";
import { Icon } from "@mdi/react";
import { mdiAccountAlertOutline, mdiDeleteOutline, mdiPlusCircleOutline } from "@mdi/js";
import { Player, TimeStamp } from "@set/timer/model";
import { PlayersDialPad } from "./players-dial-pad";
import { TimeStampDisplay } from "./time-stamp-display";
import { useState } from "react";
import { useTimerDispatch } from "../hooks";

type TimeStampWithPlayer = TimeStamp & {
    player?: Player;
};

type PlayersTimesProps = {
    times: TimeStampWithPlayer[];
    onAddTime: () => void;
};

const sort = (times: TimeStampWithPlayer[]) => [...times].sort((a, b) => b.time - a.time);

export const PlayersTimes = ({ times, onAddTime }: PlayersTimesProps) => {
    const [timeStampToAssign, setTimeStampToAssign] = useState<number>();
    const { Portal } = usePortal({ bindTo: document.getElementById("module-holder") as HTMLElement });
    const dispatch = useTimerDispatch();

    return (
        <div className="px-4">
            {timeStampToAssign !== undefined && (
                <Portal>
                    <div className="absolute inset-0 h-full w-full bg-gray-800">
                        <PlayersDialPad
                            onPlayerCheckIn={(playerId) => {
                                dispatch(assignPlayer({ playerId, id: timeStampToAssign }));
                                setTimeStampToAssign(undefined);
                            }}
                            title="Assign time to player"
                        />
                    </div>
                </Portal>
            )}
            <div className="flex flex-col mt-2">
                <button
                    onClick={onAddTime}
                    className="self-end rounded-md text-center bg-gradient-to-r w-20 flex justify-center from-orange-500 to-red-500 py-2 px-4"
                >
                    <Icon color="white" size={1} path={mdiPlusCircleOutline} />
                </button>
            </div>
            {sort(times).map((t) => (
                <div key={t.id} className="flex my-2">
                    <span className="flex-grow">
                        <TimeStampDisplay timeStamp={t} />
                    </span>
                    {t.player ? (
                        <ActionButton
                            text={formatNumber(t.player.number, 3)}
                            onClick={() => {
                                dispatch(reset({ id: t.id }));
                            }}
                        />
                    ) : (
                        <PrimaryActionButton onClick={() => setTimeStampToAssign(t.id)} icon={mdiAccountAlertOutline} />
                    )}
                    <span className="ml-1">
                        {" "}
                        <ActionButton
                            icon={mdiDeleteOutline}
                            onClick={() => {
                                dispatch(reset({ id: t.id }));
                            }}
                        />
                    </span>
                </div>
            ))}
        </div>
    );
};
