import { mdiAlarmCheck, mdiAlarmOff, mdiWrench } from "@mdi/js";
import { getCurrentTime, sort } from "@set/shared/dist";
import { Player, TimeStamp } from "@set/timer/dist/model";
import { add, reset } from "@set/timer/dist/slices/time-stamps";
import { PrimaryActionButton, ActionButton } from "components/stopwatch/action-button";
import { PlayerWithTimeStampDisplay } from "components/stopwatch/player-with-timestamp-display";
import { useTimerDispatch, useTimerSelector } from "hooks";
import { useRouter } from "next/router";

type PlayerWithTimeStamp = Player & {
    timeStamp?: TimeStamp;
};

const PlayersList = () => {
    const allPlayers = useTimerSelector((x) => x.players);
    const allTimeStamps = useTimerSelector((x) => x.timeStamps);
    const timeKeeperId = useTimerSelector((x) => x.userConfig?.timeKeeperId);
    const offset = useTimerSelector((x) => x.timeKeeperConfig?.timeOffset);
    const players = sort(
        allPlayers.map((x) => ({
            ...x,
            timeStamp: allTimeStamps.find((a) => a.bibNumber === x.bibNumber && a.timeKeeperId === timeKeeperId),
        })),
        (p) => p.startTime || Number.MAX_VALUE
    );
    const dispatch = useTimerDispatch();

    const onReset = (id: number) => dispatch(reset({ id }));
    const onRecord = (bibNumber: number) =>
        dispatch(
            add({
                bibNumber,
                timeKeeperId: timeKeeperId!,
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
                                push(`/stopwatch/tweak/${p.timeStamp?.id}`);
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default PlayersList;
