import { Icon } from "@mdi/react";
import { Link, useLocation } from "react-router-dom";
import { mdiDialpad, mdiFormatListNumberedRtl, mdiTimetable } from "@mdi/js";
import { StopWatchMode } from "../stopwatch-mode";

type StopWatchModeSwitchButtonProps = { text: string; mode: StopWatchMode; icon: string; chosenMode: StopWatchMode };

const StopWatchModeSwitchButton = ({ text, mode, icon, chosenMode }: StopWatchModeSwitchButtonProps) => {
    const opacity = mode === chosenMode ? "opacity-100" : "opacity-20";
    return (
        <Link
            to={`${process.env.PUBLIC_URL}/${mode}`}
            className={`${opacity} transition-opacity w-12 flex flex-col items-center px-4 py-2`}
        >
            <Icon color="white" size={1} path={icon} />
            <p className="text-xs text-white font-semibold">{text}</p>
        </Link>
    );
};

export const StopWatchModeSwitch = () => {
    const location = useLocation();
    // const mode = location.pathname.split('process.env.PUBLIC_URL')[1].slice(1) as StopWatchMode;
    const mode = "" as StopWatchMode;

    return (
        <div className="flex justify-around text-black">
            <StopWatchModeSwitchButton mode="list" text="Players" icon={mdiFormatListNumberedRtl} chosenMode={mode} />
            <StopWatchModeSwitchButton mode="pad" text="Pad" icon={mdiDialpad} chosenMode={mode} />
            <StopWatchModeSwitchButton mode="times" text="Times" icon={mdiTimetable} chosenMode={mode} />
        </div>
    );
};
