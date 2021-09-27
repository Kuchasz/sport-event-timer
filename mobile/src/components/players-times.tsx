import { ActionButton, PrimaryActionButton } from "./action-button";
import { Icon } from "@mdi/react";
import {
    mdiAccountAlertOutline,
    mdiAccountSupervisor,
    mdiDeleteOutline,
    mdiPlusCircleOutline
    } from "@mdi/js";
import { Player, TimeStamp } from "@set/timer/model";
import { PlayerWithTimeStampDisplay } from "./player-with-timestamp-display";
import { reset } from "@set/timer/slices/time-stamps";
import { useHistory } from "react-router-dom";
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

export const PlayersTimes = ({ times, onAddTime }: PlayersTimesProps) => {
    const dispatch = useTimerDispatch();
    const history = useHistory();

    return (
        <div className="px-4">
            <div className="flex flex-col mt-2">
                <button
                    onClick={onAddTime}
                    className="self-end rounded-md text-center bg-gradient-to-r w-20 flex justify-center from-orange-500 to-red-500 py-2 px-4"
                >
                    <Icon color="white" size={1} path={mdiPlusCircleOutline} />
                </button>
            </div>
            {sort(times).map((t) => (
                <div key={t.id} className="flex py-5 items-center">
                    <PlayerWithTimeStampDisplay
                        playerWithTimeStamp={{
                            timeStamp: t,
                            number: t.player?.number,
                            name: t.player?.name,
                            lastName: t.player?.lastName
                        }}
                    />
                    {!t.player ? (
                        <PrimaryActionButton
                            onClick={() => {
                                history.push(`${process.env.PUBLIC_URL}/assign/${t.id}`);
                            }}
                            icon={mdiAccountAlertOutline}
                        />
                    ) : (
                        <ActionButton
                            icon={mdiAccountSupervisor}
                            onClick={() => {
                                history.push(`${process.env.PUBLIC_URL}/reassign/${t.id}`);
                            }}
                        />
                    )}

                    <ActionButton
                        icon={mdiDeleteOutline}
                        onClick={() => {
                            dispatch(reset({ id: t.id }));
                        }}
                    />
                </div>
            ))}
        </div>
    );
};
