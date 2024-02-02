"use client";

import { ActionButton, PrimaryActionButton } from "../../../../../../../../components/stopwatch/action-button";
import { formatNumber } from "@set/utils/dist/number";
import { mdiFloppy, mdiMinus, mdiPlus, mdiRestart } from "@mdi/js";
import { PlayerWithSplitTimeDisplay } from "../../../../../../../../components/stopwatch/player-with-split-time-display";
import type { SplitTime } from "@set/timer/dist/model";
import { useState } from "react";
import { useTimerDispatch, useTimerSelector } from "../../../../../../../../hooks";
import { useParams, useRouter } from "next/navigation";
import { tweak } from "@set/timer/dist/slices/split-times";
import { trpc } from "trpc-core";
import { getIndexById, sort } from "@set/utils/dist/array";
import { timingPointIdAtom } from "states/stopwatch-states";
import { useAtom } from "jotai";

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
    const allSplitTimes = useTimerSelector(x => x.splitTimes);
    const [timingPointId] = useAtom(timingPointIdAtom);
    const { raceId, splitTimeId } = useParams<{ raceId: string; splitTimeId: string }>()!;

    const { data: allPlayers } = trpc.player.stopwatchPlayers.useQuery({ raceId: parseInt(raceId) }, { initialData: [] });

    const dispatch = useTimerDispatch();
    const onSave = (splitTime: SplitTime) => dispatch(tweak(splitTime));

    const splitTime = allSplitTimes.find(x => x.id === parseInt(splitTimeId))!;
    const player = allPlayers.find(x => x.bibNumber === splitTime?.bibNumber);

    const timingPointSplitTimes = sort(
        allSplitTimes.filter(s => s.timingPointId === timingPointId),
        t => t.time,
    );
    const playersSplitTimes = getIndexById(
        timingPointSplitTimes,
        s => s.bibNumber!,
        s => s.id,
    );

    const [currentTime, setCurrentTime] = useState<number>(splitTime.time);

    const time = new Date(currentTime);

    const p = player ? { ...player, splitTime, splitTimes: playersSplitTimes.get(player.bibNumber) } : { splitTime };

    const highestBibNumber = Math.max(...allPlayers.map(p => p.bibNumber));

    return (
        <div className="flex h-full flex-col items-center">
            <div className="flex grow flex-col items-center justify-center">
                <div>
                    <PlayerWithSplitTimeDisplay padLeftBibNumber={highestBibNumber.toString().length} playerWithSplitTime={p} />
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
                            onSave({ ...splitTime, time: currentTime });
                            back();
                        }}
                        icon={mdiFloppy}
                    />
                    <PrimaryActionButton
                        disabled={splitTime.time === currentTime}
                        onClick={() => {
                            setCurrentTime(splitTime.time);
                        }}
                        icon={mdiRestart}
                    />
                </div>
            </div>
        </div>
    );
};
