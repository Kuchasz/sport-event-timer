import { add } from "@set/timer/dist/slices/time-stamps";
import { getCurrentTime } from "@set/utils/dist/datetime";
import { useTimerDispatch } from "../../../hooks";
import { PlayersCheckIn } from "components/stopwatch/players-check-in";
import { timingPointIdAtom, timeOffsetAtom } from "states/stopwatch-states";
import { useAtom } from "jotai";
import { trpc } from "connection";
import { useRouter } from "next/router";

const PlayersDialPad = () => {
    const dispatch = useTimerDispatch();
    const [timingPointId] = useAtom(timingPointIdAtom);
    const [offset] = useAtom(timeOffsetAtom);
    const {
        query: { raceId },
    } = useRouter();
    const { data: race } = trpc.race.basicInfo.useQuery({ raceId: parseInt(raceId as string) });

    return (
        <PlayersCheckIn
            onPlayerCheckIn={bibNumber => {
                dispatch(
                    add({
                        bibNumber,
                        timingPointId,
                        time: getCurrentTime(offset, race!.date)
                    })
                );
            }}
            timingPointId={timingPointId}
        />
    );
};

export default PlayersDialPad;

export { getSecuredServerSideProps as getServerSideProps } from "../../../auth";