import Icon from "@mdi/react";
import { ActionButton } from "./action-button";
import { formatNumber } from "../utils";
import { mdiFloppy, mdiMinus, mdiPlus } from "@mdi/js";
import { PlayerWithTimeStampDisplay } from "./player-with-timestamp-display";
import { TimeStamp } from "../../../timer/model";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useTimerSelector } from "../hooks";

type TypedPlayerProps = {
    playerNumber: string;
};

export const TypedPlayer = ({ playerNumber }: TypedPlayerProps) => (
    <div className="text-orange-500 h-16 flex text-center justify-center text-4xl font-regular py-2">
        {playerNumber}
    </div>
);

type BtnProps = {
    changeTime: () => void;
};

const Plus = ({ changeTime }: BtnProps) => (
    <ActionButton
        onClick={() => {
            changeTime();
        }}
        icon={mdiPlus}
    />
);
const Minus = ({ changeTime }: BtnProps) => (
    <ActionButton
        onClick={() => {
            changeTime();
        }}
        icon={mdiMinus}
    />
);
const Digit = ({ number }: { number: string }) => <div className="text-6xl mb-2 text-center">{number}</div>;

type TweakTimeStampProps = {
    onSave: (timeStamp: TimeStamp) => void;
    timeStampId: number;
};

export const TweakTimeStamps = ({ onSave, timeStampId }: TweakTimeStampProps) => {
    const allTimeStamps = useTimerSelector((x) => x.timeStamps);
    const allPlayers = useTimerSelector((x) => x.players);

    const timeStamp = allTimeStamps.find((x) => x.id === timeStampId);
    const player = allPlayers.find((x) => x.id === timeStamp?.playerId);

    const navigate = useNavigate();

    const [currentTime, setCurrentTime] = useState<number>(timeStamp!.time);

    const time = new Date(currentTime!);

    const p = player ? { ...player, timeStamp } : { timeStamp };

    return (
        <div className="flex h-full flex-col items-center">
            <h1 className="text-2xl py-4">Tweak time stamp</h1>
            <div>
                <PlayerWithTimeStampDisplay playerWithTimeStamp={p} />
            </div>
            <div className="flex items-center mt-10">
                <div className="flex-col flex items-center">
                    <Plus changeTime={() => setCurrentTime(currentTime! + 1000 * 60 * 60)} />
                    <Digit number={formatNumber(time.getHours())} />
                    <Minus changeTime={() => setCurrentTime(currentTime! - 1000 * 60 * 60)} />
                </div>
                <div className="text-6xl mb-2">:</div>
                <div className="flex-col flex items-center">
                    <Plus changeTime={() => setCurrentTime(currentTime! + 1000 * 60)} />
                    <Digit number={formatNumber(time.getMinutes())} />
                    <Minus changeTime={() => setCurrentTime(currentTime! - 1000 * 60)} />
                </div>
                <div className="text-6xl mb-2">:</div>
                <div className="flex-col flex items-center">
                    <Plus changeTime={() => setCurrentTime(currentTime! + 1000)} />
                    <Digit number={formatNumber(time.getSeconds())} />
                    <Minus changeTime={() => setCurrentTime(currentTime! - 1000)} />
                </div>
                <div className="text-6xl mb-2">.</div>
                <div className="flex-col flex items-center">
                    <Plus changeTime={() => setCurrentTime(currentTime! + 100)} />
                    <Digit number={formatNumber(Math.floor(time.getMilliseconds() / 100), 1)} />
                    <Minus changeTime={() => setCurrentTime(currentTime! - 100)} />
                </div>
            </div>
            <button
                onClick={() => {
                    onSave({ ...timeStamp!, time: currentTime });
                    navigate(-1);
                }}
                className="rounded-md mt-6 text-center bg-gradient-to-r w-20 flex justify-center from-orange-500 to-red-500 py-2 px-4"
            >
                <Icon color="white" size={1} path={mdiFloppy} />
            </button>
        </div>
    );
};
