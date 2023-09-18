"use client"

import {
    mdiHomeOutline,
    mdiViewDashboardEditOutline,
    mdiBikeFast,
    mdiBriefcaseOutline,
    mdiTimetable,
    mdiAccount,
    mdiAlarm,
    mdiNumeric,
    mdiAccountGroup,
    mdiAccountCogOutline,
    mdiTimerCogOutline,
    mdiCog,
} from "@mdi/js";
import { sortDesc } from "@set/utils/dist/array";
import { useCurrentRaceId } from "hooks";
import { Route } from "next";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { MenuButton } from "./menu-button";
import { MenuHeader } from "./menu-header";

export const Menu = () => {
    const t = useTranslations();
    const pathname = usePathname();
    const raceId = useCurrentRaceId();

    const generalMenuGroup = {
        name: t("menuOptions.general.title"),
        icon: mdiHomeOutline,
        color: "bg-[#64b3f4]",
        to: "/panel",
        items: [
            {
                text: t("menuOptions.general.dashboard"),
                icon: mdiViewDashboardEditOutline,
                to: "/panel",
                color: "text-yellow-700",
                bg: "bg-yellow-100",
            },
            {
                text: t("menuOptions.general.races"),
                icon: mdiBikeFast,
                to: "/panel/my-races",
                color: "text-red-700",
                bg: "bg-red-50",
            },
        ],
    };

    const adminMenuGroup = {
        name: t("menuOptions.admin.title"),
        icon: mdiBriefcaseOutline,
        color: "bg-orange-500",
        to: "/panel/admin",
        items: [
            {
                text: t("menuOptions.admin.dashboard"),
                icon: mdiViewDashboardEditOutline,
                to: "/panel/admin",
                color: "text-yellow-700",
                bg: "bg-yellow-50",
            },
            {
                text: t("menuOptions.admin.races"),
                icon: mdiBikeFast,
                to: "/panel/admin/races",
                color: "text-green-700",
                bg: "bg-green-50",
            },
            {
                text: t("menuOptions.admin.hello"),
                icon: mdiTimetable,
                to: "/panel/admin/hello",
                color: "text-red-700",
                bg: "bg-red-50",
            },
            {
                text: t("menuOptions.admin.accounts"),
                icon: mdiAccount,
                to: "/panel/admin/accounts",
                color: "text-pink-700",
                bg: "bg-pink-50",
            },
        ],
    };

    const raceMenuGroup = {
        name: t("menuOptions.race.title"),
        icon: mdiAlarm,
        color: "bg-[#c2e59c]",
        to: "/panel/:raceId",
        items: [
            {
                text: t("menuOptions.race.index"),
                icon: mdiViewDashboardEditOutline,
                to: "/panel/:raceId",
                color: "text-yellow-700",
                bg: "bg-yellow-50",
            },
            {
                text: t("menuOptions.race.bibNumbers"),
                icon: mdiNumeric,
                to: "/panel/:raceId/bib-numbers",
                color: "text-green-700",
                bg: "bg-green-50",
            },
            {
                text: t("menuOptions.race.players"),
                icon: mdiAccountGroup,
                to: "/panel/:raceId/players",
                color: "text-pink-700",
                bg: "bg-pink-50",
            },
            {
                text: t("menuOptions.race.registrations"),
                icon: mdiAccountGroup,
                to: "/panel/:raceId/player-registrations",
                color: "text-yellow-700",
                bg: "bg-yellow-50",
            },
            {
                text: t("menuOptions.race.classifications"),
                icon: mdiAccountCogOutline,
                to: "/panel/:raceId/classifications",
                color: "text-purple-700",
                bg: "bg-purple-50",
            },
            {
                text: t("menuOptions.race.timingPoints"),
                icon: mdiTimerCogOutline,
                to: "/panel/:raceId/timing-points",
                color: "text-lime-700",
                bg: "bg-lime-50",
            },
            {
                text: t("menuOptions.race.splitTimes"),
                icon: mdiAlarm,
                to: "/panel/:raceId/split-times",
                color: "text-red-700",
                bg: "bg-red-50",
            },
            {
                text: t("menuOptions.race.results"),
                icon: mdiTimetable,
                to: "/panel/:raceId/results",
                color: "text-blue-700",
                bg: "bg-blue-50",
            },
            {
                text: t("menuOptions.race.settings"),
                icon: mdiCog,
                to: "/panel/:raceId/settings",
                color: "text-orange-700",
                bg: "bg-orange-50",
            },
        ],
    };

    const routeMatched = (route: string, currentPath: string) => {
        const reg = new RegExp(`^${route.replaceAll(/:\w+/g, "\\d+")}(\/?\\w*)*$`);
        return reg.test(currentPath);
    };

    const menuGroups = [generalMenuGroup, raceMenuGroup, adminMenuGroup];

    const matchedRoutes = menuGroups.flatMap(g => g.items).filter(r => routeMatched(r.to, pathname!));

    const longestMatchedRoute = sortDesc(matchedRoutes, r => r.to.length)[0];

    return (
        <>
            {menuGroups.map(g => (
                <div key={g.name}>
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
        </>
    );
};
