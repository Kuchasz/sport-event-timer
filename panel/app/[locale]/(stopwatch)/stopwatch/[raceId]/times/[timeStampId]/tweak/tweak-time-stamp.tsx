"use client";

import { ActionButton, PrimaryActionButton } from "../../../../../../../../components/stopwatch/action-button";
import { formatNumber } from "@set/utils/dist/number";
import { mdiFloppy, mdiMinus, mdiPlus, mdiRestart } from "@mdi/js";
import { PlayerWithTimeStampDisplay } from "../../../../../../../../components/stopwatch/player-with-timestamp-display";
import type { TimeStamp } from "@set/timer/dist/model";
import { useState } from "react";
import { useTimerDispatch, useTimerSelector } from "../../../../../../../../hooks";
import { useParams, useRouter } from "next/navigation";
import { tweakTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { trpc } from "trpc-core";

type TypedPlayerProps = {
    playerNumber: string;
};

export const TypedPlayer = ({ playerNumber }: TypedPlayerProps) => (
    <div className="font-regular flex h-16 justify-center py-2 text-center text-4xl text-orange-500">{playerNumber}</div>
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
const Digit = ({ number }: { number: string }) => <div className="my-4 text-center font-mono text-6xl">{number}</div>;

export const TweakTimeStamp = () => {
    //eslint-disable-next-line @typescript-eslint/unbound-method
    const { back } = useRouter() as unknown as { back: () => void };
    const allTimeStamps = useTimerSelector(x => x.timeStamps);
    const { raceId, timeStampId } = useParams<{ raceId: string; timeStampId: string }>()!;

    const { data: allPlayers } = trpc.player.stopwatchPlayers.useQuery({ raceId: parseInt(raceId) }, { initialData: [] });

    const dispatch = useTimerDispatch();
    const onSave = (timeStamp: TimeStamp) => dispatch(tweakTimeStamp(timeStamp));

    const timeStamp = allTimeStamps.find(x => x.id === parseInt(timeStampId));
    const player = allPlayers.find(x => x.bibNumber === timeStamp?.bibNumber);

    const [currentTime, setCurrentTime] = useState<number>(timeStamp!.time);

    const time = new Date(currentTime);

    const p = player ? { ...player, timeStamp } : { timeStamp };

    const highestBibNumber = Math.max(...allPlayers.map(p => p.bibNumber));

    return (
        <div className="flex h-full flex-col items-center">
            <div className="flex grow flex-col items-center justify-center">
                <div>
                    <PlayerWithTimeStampDisplay padBibNumber={highestBibNumber.toString().length} playerWithTimeStamp={p} />
                </div>
                <div className="mt-10 flex items-center">
                    <div className="flex flex-col items-center">
                        <Plus changeTime={() => setCurrentTime(currentTime + 1000 * 60 * 60)} />
                        <Digit number={formatNumber(time.getHours())} />
                        <Minus changeTime={() => setCurrentTime(currentTime - 1000 * 60 * 60)} />
                    </div>
                    <div className="mb-2 text-6xl">:</div>
                    <div className="flex flex-col items-center">
                        <Plus changeTime={() => setCurrentTime(currentTime + 1000 * 60)} />
                        <Digit number={formatNumber(time.getMinutes())} />
                        <Minus changeTime={() => setCurrentTime(currentTime - 1000 * 60)} />
                    </div>
                    <div className="mb-2 text-6xl">:</div>
                    <div className="flex flex-col items-center">
                        <Plus changeTime={() => setCurrentTime(currentTime + 1000)} />
                        <Digit number={formatNumber(time.getSeconds())} />
                        <Minus changeTime={() => setCurrentTime(currentTime - 1000)} />
                    </div>
                    <div className="mb-2 text-6xl">.</div>
                    <div className="flex flex-col items-center">
                        <Plus changeTime={() => setCurrentTime(currentTime + 100)} />
                        <Digit number={formatNumber(Math.floor(time.getMilliseconds() / 100), 1)} />
                        <Minus changeTime={() => setCurrentTime(currentTime - 100)} />
                    </div>
                </div>
                <div className="mt-6 flex">
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
