import { Icon } from "@mdi/react";
import Link from "next/link";
import { mdiCog, mdiDialpad, mdiFormatListNumberedRtl, mdiHistory, mdiTimetable } from "@mdi/js";
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
    const opacity = `/stopwatch/${path}` === chosenPath ? "opacity-100 pointer-events-none" : "opacity-20 hover:opacity-50 cursor-pointer";
    return (
        <Link href={`/stopwatch/${path}`}>
            <span className={`${opacity} transition-opacity w-12 flex flex-col items-center px-4 py-2`}>
                <Icon color="white" size={1} path={icon} />
                <p className="text-xs text-white font-semibold">{text}</p>
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
        <div className="flex justify-around select-none text-black">
            <BottomMenuButton path={raceId + "/config"} text="Config" icon={mdiCog} chosenPath={mode} />
            <BottomMenuButton path={raceId + "/list"} text="Players" icon={mdiFormatListNumberedRtl} chosenPath={mode} />
            <BottomMenuButton path={raceId + "/pad"} text="Pad" icon={mdiDialpad} chosenPath={mode} />
            <BottomMenuButton path={raceId + "/times"} text="Times" icon={mdiTimetable} chosenPath={mode} />
            <BottomMenuButton path={raceId + "/history"} text="History" icon={mdiHistory} chosenPath={mode} />
        </div>
    );
};
