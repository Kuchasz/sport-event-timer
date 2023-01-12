import { sort } from "@set/utils/dist/array";
import { TimeKeeperIcon } from "../../../components/stopwatch/time-keeper-icon";
import { timingPointIdAtom } from "stopwatch-states";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import Icon from "@mdi/react";
import { mdiCheck } from "@mdi/js";
import classNames from "classnames";
import { trpc } from "connection";

const Config = () => {
    const [timingPointId, chooseTimingPoint] = useAtom(timingPointIdAtom);
    const {
        query: { raceId },
    } = useRouter();
    const { data: allTimeKeepers } = trpc.timingPoint.timingPoints.useQuery({ raceId: parseInt(raceId as string) }, {
        initialData: [],
    });
    const sortedTimeKeepers = sort(allTimeKeepers || [], (tk) => tk.order);

    const setTimingPointId = (timingPointId: number) => {
        chooseTimingPoint(timingPointId);
    };

    return (
        <div className="flex h-full w-full items-center flex-col">
            <div className="flex flex-grow h-full w-full justify-center items-center flex-col">
                {sortedTimeKeepers.map((tk, id) => (
                    <button
                        onClick={() => setTimingPointId(tk.id)}
                        className="flex py-2 px-3 items-center relative rounded-xl shadow bg-white transition-opacity my-2"
                        key={tk.id}
                    >
                        <TimeKeeperIcon isFirst={id === 0} isLast={id === sortedTimeKeepers.length - 1} />
                        <span className="ml-4 text-xl">{tk.name}</span>
                        <Icon
                            className={classNames("transition-all", { ["ml-3"]: tk.id === timingPointId })}
                            size={tk.id === timingPointId ? 1 : 0}
                            path={mdiCheck}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Config;
