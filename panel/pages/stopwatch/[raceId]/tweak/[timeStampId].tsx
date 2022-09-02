import Icon from "@mdi/react";
import { ActionButton } from "../../../../components/stopwatch/action-button";
import { formatNumber } from "@set/shared/dist/utils";
import { mdiFloppy, mdiMinus, mdiPlus, mdiRestart } from "@mdi/js";
import { PlayerWithTimeStampDisplay } from "../../../../components/stopwatch/player-with-timestamp-display";
import { TimeStamp } from "@set/timer/dist/model";
import { useState } from "react";
import { useTimerDispatch, useTimerSelector } from "../../../../hooks";
import { useRouter } from "next/router";
import { tweakTimeStamp } from "@set/timer/dist/slices/time-stamps";
import { trpc } from "trpc";

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

const TweakTimeStamps = () => {
    const {
        query: { timeStampId },
        back,
    } = useRouter();
    const allTimeStamps = useTimerSelector((x) => x.timeStamps);
    const {
        query: { raceId },
    } = useRouter();

    const { data: allPlayers } = trpc.useQuery(["player.stopwatch-players", { raceId: parseInt(raceId as string) }], { initialData: [] });

    const dispatch = useTimerDispatch();
    const onSave = (timeStamp: TimeStamp) => dispatch(tweakTimeStamp(timeStamp));

    const timeStamp = allTimeStamps.find((x) => x.id === parseInt(timeStampId! as string));
    const player = allPlayers!.find((x) => x.bibNumber === timeStamp?.bibNumber);

    const [currentTime, setCurrentTime] = useState<number>(timeStamp!.time);

    const time = new Date(currentTime!);

    const p = player ? { ...player, timeStamp } : { timeStamp };

    return (
        <div className="flex h-full flex-col items-center">
            <h1 className="text-2xl py-4">Tweak time stamp</h1>
            <div className="flex flex-col grow items-center justify-center">
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
                <div className="flex mt-6">
                    <button
                        onClick={() => {
                            onSave({ ...timeStamp!, time: currentTime });
                            back();
                        }}
                        className="rounded-md mx-2 text-center bg-gradient-to-r w-20 flex justify-center from-orange-500 to-red-500 py-2 px-4"
                    >
                        <Icon color="white" size={1} path={mdiFloppy} />
                    </button>
                    <button
                        disabled={timeStamp!.time === currentTime}
                        onClick={() => {
                            setCurrentTime(timeStamp!.time);
                        }}
                        className="rounded-md mx-2 text-center disabled:grayscale bg-gradient-to-r w-20 flex justify-center from-orange-500 to-red-500 py-2 px-4"
                    >
                        <Icon color="white" size={1} path={mdiRestart} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TweakTimeStamps;
