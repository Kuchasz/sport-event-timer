import { Icon } from "@mdi/react";
import Link from "next/link";
import { mdiDialpad, mdiFormatListNumberedRtl, mdiHistory, mdiTimetable } from "@mdi/js";
// import { connectionStateAtom, StopWatchMode } from "../../states/stopwatch-states";
import type { StopWatchMode } from "../../states/stopwatch-states";
// import { ConnectionState } from "@set/timer/dist/model";
import classNames from "classnames";
// import { useAtom } from "jotai";

type PathTypes = StopWatchMode | "config" | "history";
type Paths = `${string}/${PathTypes}`;
type BottomMenuButtonProps = {
    text: string;
    path: string;
    icon: string;
    chosenPath: Paths;
};

const BottomMenuButton = ({ text, path, icon, chosenPath }: BottomMenuButtonProps) => {
    const classes =
        `/stopwatch/${path}` === chosenPath
            ? "opacity-100 pointer-events-none bg-orange-100 text-orange-600"
            : "opacity-40 hover:opacity-80 cursor-pointer background-transparent";
    const classesText = `/stopwatch/${path}` === chosenPath ? "ml-2 max-w-xs text-orange-600" : "ml-0 max-w-0 text-transparent";
    return (
        <Link href={`/stopwatch/${path}`}>
            <span className={`${classes} flex items-center rounded-full px-4 py-1.5 transition-all duration-500`}>
                <Icon size={0.8} path={icon} />
                <span className={`${classesText} overflow-hidden text-sm font-semibold transition-all duration-500`}>{text}</span>
            </span>
        </Link>
    );
};

export const BottomMenu = ({
    pathname,
    raceId,
    isOffline,
    timingPointMissing,
}: {
    pathname: string;
    raceId: string;
    isOffline: boolean;
    timingPointMissing: boolean;
}) => {
    const mode = pathname as Paths;
    // const [connectionState, setConnectionState] = useAtom(connectionStateAtom);

    return (
        <div
            className={classNames("flex select-none justify-around rounded-t-lg bg-white py-3 transition-transform ease-out", {
                ["translate-y-full"]: isOffline || timingPointMissing,
            })}
        >
            {/* <button
                className="absolute bg-orange-500 text-white font-bold px-4 shadow-md rounded-full py-1 -translate-y-24"
                onClick={() => {
                    if (connectionState === "connected") {
                        setConnectionState("error");
                    } else if (connectionState === "error") {
                        setConnectionState("disconnected");
                    } else if (connectionState === "disconnected") {
                        setConnectionState("connecting");
                    } else {
                        setConnectionState("connected");
                    }
                }}
            >
                FAKE STATE
            </button> */}
            <BottomMenuButton path={raceId + "/list"} text="Players" icon={mdiFormatListNumberedRtl} chosenPath={mode} />
            <BottomMenuButton path={raceId + "/pad"} text="Pad" icon={mdiDialpad} chosenPath={mode} />
            <BottomMenuButton path={raceId + "/times"} text="Times" icon={mdiTimetable} chosenPath={mode} />
            <BottomMenuButton path={raceId + "/history"} text="History" icon={mdiHistory} chosenPath={mode} />
        </div>
    );
};
