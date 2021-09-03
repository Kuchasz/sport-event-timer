import iconDialPad from "../icons/dialpad.svg";
import iconDotsGrid from "../icons/dots-grid.svg";
import iconFormatListNumbered from "../icons/format-list-numbered.svg";
import iconTimeTable from "../icons/timetable.svg";
import { Link, useLocation } from "react-router-dom";
import { StopWatchMode } from "../stopwatch-mode";

type StopWatchModeSwitchButtonProps = { text: string; mode: StopWatchMode; icon: string; chosenMode: StopWatchMode };

const StopWatchModeSwitchButton = ({ text, mode, icon, chosenMode }: StopWatchModeSwitchButtonProps) => {
    const opacity = mode === chosenMode ? "opacity-100" : "opacity-50";
    return (
        <Link to={`/${mode}`} className={`${opacity} flex flex-col items-center px-4 py-2 mr-4`}>
            <img src={icon} height="20" width="20" alt=""></img>
            <p className="text-xs font-semibold">{text}</p>
        </Link>
    );
};

export const StopWatchModeSwitch = () => {
    const location = useLocation();
    const mode = location.pathname.slice(1) as StopWatchMode;
    return (
        <div className="flex justify-around text-black">
            <StopWatchModeSwitchButton mode="list" text="List" icon={iconFormatListNumbered} chosenMode={mode} />
            <StopWatchModeSwitchButton mode="grid" text="Grid" icon={iconDotsGrid} chosenMode={mode} />
            <StopWatchModeSwitchButton mode="pad" text="Pad" icon={iconDialPad} chosenMode={mode} />
            <StopWatchModeSwitchButton mode="times" text="Times" icon={iconTimeTable} chosenMode={mode} />
        </div>
    );
};
