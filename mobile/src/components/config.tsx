import { CurrentTimeKeeperContext } from "../contexts/current-time-keeper";
import { TimeKeeperIcon } from "./time-keeper-icon";
import { useTimerSelector } from "../hooks";

export const Config = () => {
    const allTimeKeepers = useTimerSelector((x) => x.timeKeepers);

    return (
        <CurrentTimeKeeperContext.Consumer>
            {({ setTimeKeeperId }) => (
                <div className="flex h-full w-full justify-center items-start bg-gray-800 pl-20 flex-col">
                    {allTimeKeepers.map((tk) => (
                        <button
                            onClick={() => setTimeKeeperId(tk.id)}
                            className="flex items-center py-4 px-4 my-2"
                            key={tk.id}
                        >
                            <TimeKeeperIcon type={tk.type} />
                            <span className="ml-4 text-xl">{tk.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </CurrentTimeKeeperContext.Consumer>
    );
};
