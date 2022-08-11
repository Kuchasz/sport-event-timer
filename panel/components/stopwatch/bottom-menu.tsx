import { Icon } from "@mdi/react";
import Link from "next/link";
import {
    mdiCog,
    mdiDialpad,
    mdiFormatListNumberedRtl,
    mdiHistory,
    mdiTimetable,
} from "@mdi/js";
import { StopWatchMode } from "../../stopwatch-mode";
import { useRouter } from "next/router";

type Paths = StopWatchMode | "config" | "history";
type BottomMenuButtonProps = {
    text: string;
    path: Paths;
    icon: string;
    chosenPath: Paths;
};

const BottomMenuButton = ({
    text,
    path,
    icon,
    chosenPath: chosenMode,
}: BottomMenuButtonProps) => {
    const opacity = path === chosenMode ? "opacity-100" : "opacity-20";
    return (
        <Link href={`stopwatch/${path}`}>
            <span
                className={`${opacity} hover:opacity-50 transition-opacity w-12 flex flex-col items-center px-4 py-2`}
            >
                <Icon color="white" size={1} path={icon} />
                <p className="text-xs text-white font-semibold">{text}</p>
            </span>
        </Link>
    );
};

export const BottomMenu = () => {
    const { asPath } = useRouter();
    const mode = asPath as Paths;

    return (
        <div className="flex justify-around select-none text-black">
            <BottomMenuButton
                path="config"
                text="Config"
                icon={mdiCog}
                chosenPath={mode}
            />
            <BottomMenuButton
                path="list"
                text="Players"
                icon={mdiFormatListNumberedRtl}
                chosenPath={mode}
            />
            <BottomMenuButton
                path="pad"
                text="Pad"
                icon={mdiDialpad}
                chosenPath={mode}
            />
            <BottomMenuButton
                path="times"
                text="Times"
                icon={mdiTimetable}
                chosenPath={mode}
            />
            <BottomMenuButton
                path="history"
                text="History"
                icon={mdiHistory}
                chosenPath={mode}
            />
        </div>
    );
};
