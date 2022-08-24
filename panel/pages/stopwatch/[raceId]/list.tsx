import { mdiAlarmCheck, mdiAlarmOff, mdiWrench } from "@mdi/js";
import { getCurrentTime, sort } from "@set/shared/dist";
import { add, reset } from "@set/timer/dist/slices/time-stamps";
import { PrimaryActionButton, ActionButton } from "components/stopwatch/action-button";
import { PlayerWithTimeStampDisplay } from "components/stopwatch/player-with-timestamp-display";
import { useTimerDispatch, useTimerSelector } from "hooks";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { timingPointIdAtom, timeOffsetAtom } from "stopwatch-states";
import { trpc } from "trpc";

const PlayersList = () => {
    const [timingPointId] = useAtom(timingPointIdAtom);
    const [offset] = useAtom(timeOffsetAtom);

    const {
        query: { raceId },
    } = useRouter();

    const { data: allPlayers } = trpc.useQuery(["player.stopwatch-players", { raceId: parseInt(raceId as string) }], { initialData: [] });

    const allTimeStamps = useTimerSelector((x) => x.timeStamps);

    const players = sort(
        allPlayers!.map((x) => ({
            ...x,
            timeStamp: allTimeStamps.find((a) => a.bibNumber === x.bibNumber && a.timingPointId === timingPointId),
        })),
        (p) => p.startTime || Number.MAX_VALUE
    );
    const dispatch = useTimerDispatch();

    const onReset = (id: number) => dispatch(reset({ id }));
    const onRecord = (bibNumber: number) =>
        dispatch(
            add({
                bibNumber,
                timingPointId: timingPointId!,
                time: getCurrentTime(offset!),
            })
        );
    const { push } = useRouter();
    return (
        <div className="px-4 text-white">
            {players.map((p) => (
                <div key={p.bibNumber} className="py-5 flex items-center">
                    <PlayerWithTimeStampDisplay playerWithTimeStamp={p} />
                    {p.timeStamp ? (
                        <PrimaryActionButton icon={mdiAlarmOff} onClick={() => onReset(p.timeStamp!.id)} />
                    ) : (
                        <PrimaryActionButton icon={mdiAlarmCheck} onClick={() => onRecord(p.bibNumber)} />
                    )}
                    {p.timeStamp && (
                        <ActionButton
                            icon={mdiWrench}
                            onClick={() => {
                                push(`/stopwatch/${raceId}/tweak/${p.timeStamp?.id}`);
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default PlayersList;
