import { Icon } from "@mdi/react";
import { Link, useLocation } from "react-router-dom";
import {
    mdiCog,
    mdiDialpad,
    mdiFormatListNumberedRtl,
    mdiTimetable
    } from "@mdi/js";
import { StopWatchMode } from "../stopwatch-mode";

type Paths = StopWatchMode | "config";
type BottomMenuButtonProps = { text: string; path: Paths; icon: string; chosenPath: Paths };

const BottomMenuButton = ({ text, path, icon, chosenPath: chosenMode }: BottomMenuButtonProps) => {
    const opacity = path === chosenMode ? "opacity-100" : "opacity-20";
    return (
        <Link
            to={`${process.env.PUBLIC_URL}/${path}`}
            className={`${opacity} transition-opacity w-12 flex flex-col items-center px-4 py-2`}
        >
            <Icon color="white" size={1} path={icon} />
            <p className="text-xs text-white font-semibold">{text}</p>
        </Link>
    );
};

export const BottomMenu = () => {
    const location = useLocation();
    const mode = location.pathname.split(process.env.PUBLIC_URL)[1].slice(1) as Paths;

    return (
        <div className="flex justify-around text-black">
            <BottomMenuButton path="config" text="Config" icon={mdiCog} chosenPath={mode} />
            <BottomMenuButton path="list" text="Players" icon={mdiFormatListNumberedRtl} chosenPath={mode} />
            <BottomMenuButton path="pad" text="Pad" icon={mdiDialpad} chosenPath={mode} />
            <BottomMenuButton path="times" text="Times" icon={mdiTimetable} chosenPath={mode} />
        </div>
    );
};
