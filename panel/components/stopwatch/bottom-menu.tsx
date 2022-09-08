import { Icon } from "@mdi/react";
import Link from "next/link";
import { mdiDialpad, mdiFormatListNumberedRtl, mdiHistory, mdiTimetable } from "@mdi/js";
import { StopWatchMode } from "../../stopwatch-states";
import { useRouter } from "next/router";

type PathTypes = StopWatchMode | "config" | "history";
type Paths = `${string}/${PathTypes}`;
type BottomMenuButtonProps = {
    text: string;
    path: string;
    icon: string;
    chosenPath: Paths;
};

const BottomMenuButton = ({ text, path, icon, chosenPath }: BottomMenuButtonProps) => {
    const classes = `/stopwatch/${path}` === chosenPath ? "opacity-100 pointer-events-none bg-orange-100 text-orange-600" : "opacity-40 hover:opacity-80 cursor-pointer background-transparent";
    const classesText = `/stopwatch/${path}` === chosenPath ? 'w-auto ml-2 text-orange-600' : 'w-[0px] ml-0 text-transparent';
    return (
        <Link href={`/stopwatch/${path}`}>
            <span className={`${classes} rounded-full transition-all flex items-center px-4 py-1.5`}>
                <Icon size={1} path={icon} />
                <p className={`${classesText} transition-all text-sm font-semibold`}>{text}</p>
            </span>
        </Link>
    );
};

export const BottomMenu = () => {
    const {
        asPath,
        query: { raceId },
    } = useRouter();
    const mode = asPath as Paths;

    return (
        <div className="flex rounded-t-2xl justify-around select-none bg-white py-3">
            <BottomMenuButton path={raceId + "/list"} text="Players" icon={mdiFormatListNumberedRtl} chosenPath={mode} />
            <BottomMenuButton path={raceId + "/pad"} text="Pad" icon={mdiDialpad} chosenPath={mode} />
            <BottomMenuButton path={raceId + "/times"} text="Times" icon={mdiTimetable} chosenPath={mode} />
            <BottomMenuButton path={raceId + "/history"} text="History" icon={mdiHistory} chosenPath={mode} />
        </div>
    );
};
