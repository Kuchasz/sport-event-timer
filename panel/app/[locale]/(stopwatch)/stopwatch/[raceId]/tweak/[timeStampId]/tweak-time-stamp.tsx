"use client";

import { ActionButton, PrimaryActionButton } from "../../../../../../../components/stopwatch/action-button";
import { formatNumber } from "@set/utils/dist/number";
import { mdiFloppy, mdiMinus, mdiPlus, mdiRestart } from "@mdi/js";
import { PlayerWithTimeStampDisplay } from "../../../../../../../components/stopwatch/player-with-timestamp-display";
import { TimeStamp } from "@set/timer/dist/model";
import { useState } from "react";
import { useTimerDispatch, useTimerSelector } from "../../../../../../../hooks";
import { useParams, useRouter } from "next/navigation";
import { tweakTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { trpc } from "trpc-core";

type TypedPlayerProps = {
    playerNumber: string;
};

export const TypedPlayer = ({ playerNumber }: TypedPlayerProps) => (
    <div className="text-orange-500 h-16 flex text-center justify-center text-4xl font-regular py-2">{playerNumber}</div>
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
const Digit = ({ number }: { number: string }) => <div className="font-mono text-6xl my-4 text-center">{number}</div>;

export const TweakTimeStamp = () => {
    const { back } = useRouter();
    const allTimeStamps = useTimerSelector(x => x.timeStamps);
    const { raceId, timeStampId } = useParams() as { raceId: string; timeStampId: string };

    const { data: allPlayers } = trpc.player.stopwatchPlayers.useQuery({ raceId: parseInt(raceId as string) }, { initialData: [] });

    const dispatch = useTimerDispatch();
    const onSave = (timeStamp: TimeStamp) => dispatch(tweakTimeStamp(timeStamp));

    const timeStamp = allTimeStamps.find(x => x.id === parseInt(timeStampId! as string));
    const player = allPlayers!.find(x => x.bibNumber === timeStamp?.bibNumber);

    const [currentTime, setCurrentTime] = useState<number>(timeStamp!.time);

    const time = new Date(currentTime!);

    const p = player ? { ...player, timeStamp } : { timeStamp };

    const highestBibNumber = Math.max(...allPlayers.map(p => p.bibNumber));

    return (
        <div className="flex h-full flex-col items-center">
            <h1 className="text-2xl py-4">Tweak time stamp</h1>
            <div className="flex flex-col grow items-center justify-center">
                <div>
                    <PlayerWithTimeStampDisplay padBibNumber={highestBibNumber.toString().length} playerWithTimeStamp={p} />
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
                <div className="flex mt-6">
                    <PrimaryActionButton
                        onClick={() => {
                            onSave({ ...timeStamp!, time: currentTime });
                            back();
                        }}
                        icon={mdiFloppy}
                    />
                    <PrimaryActionButton
                        disabled={timeStamp!.time === currentTime}
                        onClick={() => {
                            setCurrentTime(timeStamp!.time);
                        }}
                        icon={mdiRestart}
                    />
                </div>
            </div>
        </div>
    );
};
