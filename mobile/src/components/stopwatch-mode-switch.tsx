import { Link } from "react-router-dom";
import { StopWatchMode } from "../stopwatch-mode";

const StopWatchModeSwitchButton = ({ text, mode }: { text: string; mode: StopWatchMode }) => (
    <Link to={`/${mode}`} className="hover:bg-orange-500 bg-gray-700 rounded-md px-4 py-2 mr-4">
        {text}
    </Link>
);

type StopWatchModeSwitchProps = {
    mode: StopWatchMode;
};

export const StopWatchModeSwitch = ({ mode }: StopWatchModeSwitchProps) => (
    <div className="flex mt-5">
        <StopWatchModeSwitchButton mode="list" text="List" />
        <StopWatchModeSwitchButton mode="grid" text="Grid" />
        <StopWatchModeSwitchButton mode="pad" text="Pad" />
    </div>
);
