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
    
    const { data: allTimingPoints } = trpc.timingPoint.timingPoints.useQuery({ raceId: parseInt(raceId as string) }, {
        initialData: [],
    });

    const {data: timingPointsOrder } = trpc.timingPoint.timingPointsOrder.useQuery({raceId: parseInt(raceId as string)}, {
        initialData: []
    });

    const sortedTimingPoints = timingPointsOrder.map(point => allTimingPoints.find(tp => point === tp.id)!);
 
    const setTimingPointId = (timingPointId: number) => {
        chooseTimingPoint(timingPointId);
    };

    return (
        <div className="flex h-full w-full items-center flex-col">
            <div className="flex flex-grow h-full w-full justify-center items-center flex-col">
                {sortedTimingPoints.map((tk, id) => (
                    <button
                        onClick={() => setTimingPointId(tk.id)}
                        className="flex py-2 px-3 items-center relative rounded-xl shadow bg-white transition-opacity my-2"
                        key={tk.id}
                    >
                        <TimeKeeperIcon isFirst={id === 0} isLast={id === sortedTimingPoints.length - 1} />
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
