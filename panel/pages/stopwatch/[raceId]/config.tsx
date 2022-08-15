import { sort } from "@set/shared/dist";
import { TimeKeeperIcon } from "../../../components/stopwatch/time-keeper-icon";
import { useTimerSelector } from "../../../hooks";
import { timeKeeperIdAtom } from "stopwatch-states";
import { useAtom } from "jotai";

const Config = () => {
    const [timeKeeperId, chooseTimeKeeper] = useAtom(timeKeeperIdAtom);
    const allTimeKeepers = useTimerSelector((x) => x.timeKeepers);
    const sortedTimeKeepers = sort(allTimeKeepers || [], (tk) => tk.order);

    const setTimeKeeperId = (timeKeeperId: number) => {
        chooseTimeKeeper(timeKeeperId);
    };

    return (
        <div className="flex h-full w-full items-center bg-zinc-800 flex-col">
            <div className="flex flex-grow h-full w-full justify-center items-center bg-zinc-800 flex-col">
                {sortedTimeKeepers.map((tk, id) => (
                    <button
                        onClick={() => setTimeKeeperId(tk.id)}
                        className={`flex items-center transition-opacity hover:opacity-50 py-4 px-4 my-2 ${
                            timeKeeperId === tk.id ? "" : "opacity-25"
                        }`}
                        key={tk.id}
                    >
                        <TimeKeeperIcon isFirst={id === 0} isLast={id === sortedTimeKeepers.length - 1} />
                        <span className="ml-4 text-xl">{tk.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Config;
