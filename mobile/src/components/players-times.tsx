import usePortal from "react-useportal";
import { assignPlayer } from "@set/timer/slices/time-stamps";
import { formatTime } from "../utils";
import { Player, TimeStamp } from "@set/timer/model";
import { PlayersDialPad } from "./players-dial-pad";
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
                    <div className="absolute inset-0 h-full w-full bg-orange-100">
                        <PlayersDialPad
                            onPlayerCheckIn={(playerId) => {
                                dispatch(assignPlayer({ playerId, id: timeStampToAssign }));
                                setTimeStampToAssign(undefined);
                            }}
                        />
                    </div>
                </Portal>
            )}
            <div className="flex flex-col mt-2">
                <button onClick={onAddTime} className="self-end rounded-md text-center w-40 bg-orange-500 py-2 px-4">
                    ADD RECORD
                </button>
            </div>
            {sort(times).map((t) => (
                <div key={t.id} className="flex justify-between my-2">
                    <span className="text-gray-600">{formatTime(new Date(t.time))}</span>
                    {t.player ? (
                        <div className="rounded-md text-center w-40 bg-gray-500 py-2 px-4">{t.player.number}</div>
                    ) : (
                        <button
                            onClick={() => setTimeStampToAssign(t.id)}
                            className="hover:bg-orange-500 hover:text-white hover:border-transparent rounded-md text-center w-40 border-dashed border-2 font-semibold text-black border-black py-2 px-4"
                        >
                            CHOOSE PLAYER
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};
