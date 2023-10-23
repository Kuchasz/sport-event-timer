"use client";

import { sortDesc } from "@set/utils/dist/array";
import type { Route } from "next";
import { MenuButton } from "./menu-button";
import { usePathname } from "next/navigation";

type MenuGroup = {
    name: string;
    icon: string;
    color: string;
    to: string;
    items: { text: string; icon: string; to: string; color: string; bg: string }[];
};

export const Menu = ({ groups, raceId }: { groups: MenuGroup[]; raceId: string }) => {
    const pathname = usePathname()!;

    // const pathname = headers().get('next-url')//;?.replace('/pl', '').replace('/en', '');

    const routeMatched = (route: string, currentPath: string) => {
        const reg = new RegExp(`^${route.replaceAll(/:\w+/g, "\\d+")}(\/?\\w*)*$`);
        return reg.test(currentPath);
    };

    const menuGroups = groups;

    const matchedRoutes = menuGroups.flatMap(g => g.items).filter(r => routeMatched(r.to, pathname));

    const longestMatchedRoute = sortDesc(matchedRoutes, r => r.to.length)[0];

    return (
        <>
            {menuGroups.map(g => (
                <div key={g.name}>
                    {/* <MenuHeader text={g.name} /> */}
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
        </>
    );
};
