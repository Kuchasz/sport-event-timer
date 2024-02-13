"use client";
import Icon from "@mdi/react";
import { sortDesc } from "@set/utils/dist/array";
import classNames from "classnames";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ScrollArea } from "./scroll-area";

type MenuGroup = {
    name: string;
    icon: string;
    color: string;
    to: string;
    items: { text: string; icon: string; to: string; color: string; bg: string }[];
};

export const MenuHeader = (n: { text: string }) => (
    <div className={classNames("flex items-center px-6 py-2 text-sm font-semibold")}>{n.text}</div>
);

export const MenuButton = (n: {
    color: string;
    bg: string;
    text: string;
    icon: string;
    to: Route;
    isActive: boolean;
    badgeCount?: number;
}) => (
    <Link href={n.to}>
        <div
            className={classNames("flex cursor-pointer items-center py-3 pl-6 pr-3 text-sm font-medium transition-all", {
                [n.bg]: n.isActive,
                ["text-gray-700 hover:bg-gray-100"]: !n.isActive,
                [n.color]: n.isActive,
            })}>
            <Icon className={classNames("transition-opacity", { ["opacity-75"]: !n.isActive })} size={0.8} path={n.icon}></Icon>
            <span className="ml-2.5">{n.text}</span>
            <span className="flex-grow"></span>
            {n.badgeCount != null && (
                <span className="text-2xs w-[2.5rem] rounded-full bg-blue-500 p-1 text-center text-white">{n.badgeCount}</span>
            )}
        </div>
    </Link>
);

export const Menu = ({ groups, raceId }: { groups: MenuGroup[]; raceId: string }) => {
    const pathname = usePathname()!;

    const routeMatched = (route: string, currentPath: string) => {
        const reg = new RegExp(`^${route.replaceAll(/:\w+/g, "\\d+")}(\/?\\w*)*$`);
        return reg.test(currentPath);
    };

    const menuGroups = groups;

    const matchedRoutes = menuGroups.flatMap(g => g.items).filter(r => routeMatched(r.to, pathname));

    const longestMatchedRoute = sortDesc(matchedRoutes, r => r.to.length)[0];

    return (
        <ScrollArea className="mt-8 flex-1">
            {menuGroups.map(g => (
                <div className="pt-8 first:pt-0" key={g.name}>
                    <MenuHeader text={g.name} />
                    <div>
                        {g.items.map(n => (
                            <MenuButton
                                key={n.to}
                                {...n}
                                to={n.to.replace(":raceId", String(raceId)) as Route}
                                isActive={n === longestMatchedRoute}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </ScrollArea>
    );
};