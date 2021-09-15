import { TimeKeeper } from "@set/timer/model";
import { TimeKeeperIcon } from "./time-keeper-icon";
type TimeKeeperSelectorProps = {
    timeKeepers: TimeKeeper[];
    selectedTimeKeeper?: TimeKeeper;
    timeKeeperChosen: (timeKeeperId: number) => void;
};

export const TimeKeeperSelector = ({ timeKeepers, timeKeeperChosen }: TimeKeeperSelectorProps) => (
    <div className="flex h-full w-full justify-center bg-gray-800 pl-20 flex-col absolute top-0">
        {timeKeepers.map((tk) => (
            <span onClick={() => timeKeeperChosen(tk.id)} className="flex items-center py-4" key={tk.id}>
                <TimeKeeperIcon type={tk.type} />
                <span className="ml-4 text-xl">{tk.name}</span>
            </span>
        ))}
    </div>
);
