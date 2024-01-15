import { Icon } from "@mdi/react";
import Link from "next/link";
import { mdiDialpad, mdiFormatListNumberedRtl, mdiHistory, mdiTimetable } from "@mdi/js";
import type { StopWatchMode } from "../../states/stopwatch-states";
import classNames from "classnames";
import { useTranslations } from "next-intl";

type PathTypes = StopWatchMode | "config" | "history";
type Paths = `${string}/${PathTypes}`;
type BottomMenuButtonProps = {
    text: string;
    path: string;
    icon: string;
    chosenPath: Paths;
};

const BottomMenuButton = ({ text, path, icon, chosenPath }: BottomMenuButtonProps) => {
    const classes = String(chosenPath).startsWith(`/stopwatch/${path}`)
        ? "opacity-100 pointer-events-none bg-orange-100 text-orange-600"
        : "opacity-60 hover:opacity-80 cursor-pointer background-transparent";
    const classesText = String(chosenPath).startsWith(`/stopwatch/${path}`)
        ? "ml-2 max-w-xs text-orange-600"
        : "ml-0 max-w-0 text-transparent";
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
    const t = useTranslations();

    return (
        <div
            className={classNames(
                "z-10 flex select-none justify-around border-t border-gray-100 bg-white py-3 transition-transform ease-out will-change-transform",
                {
                    ["translate-y-full"]: isOffline || timingPointMissing,
                },
            )}>
            <BottomMenuButton
                path={raceId + "/list"}
                text={t("stopwatch.menuItems.players")}
                icon={mdiFormatListNumberedRtl}
                chosenPath={mode}
            />
            <BottomMenuButton path={raceId + "/pad"} text={t("stopwatch.menuItems.pad")} icon={mdiDialpad} chosenPath={mode} />
            <BottomMenuButton path={raceId + "/times"} text={t("stopwatch.menuItems.times")} icon={mdiTimetable} chosenPath={mode} />
            <BottomMenuButton path={raceId + "/history"} text={t("stopwatch.menuItems.history")} icon={mdiHistory} chosenPath={mode} />
        </div>
    );
};
