"use client";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { CsvExportModule } from "@ag-grid-community/csv-export";

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule]);

import Icon from "@mdi/react";
import {
    mdiAccount,
    mdiAccountCogOutline,
    mdiAccountGroup,
    mdiAlarm,
    mdiBikeFast,
    mdiBriefcaseOutline,
    mdiCog,
    mdiHomeOutline,
    mdiNumeric,
    // mdiPlus,
    mdiPowerStandby,
    mdiTimerCogOutline,
    mdiTimetable,
    mdiViewDashboardEditOutline,
} from "@mdi/js";
import { Meta } from "./meta";
import { useCurrentRaceId } from "../hooks";
import { usePathname, useRouter } from "next/navigation";
// import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { MenuButton } from "./menu-button";
import Link from "next/link";
import { PoorSelect2 } from "./poor-select";
import { trpc } from "trpc-core";
import { Demodal } from "demodal";
// import { AppRouterInputs } from "trpc";
// import { RaceCreate } from "./race-create";
// import { NiceModal } from "./modal";
import { ReactNode, useEffect } from "react";
import { Route } from "next";
import { MenuHeader } from "./menu-header";
import { useAtom } from "jotai";
import { selectedRaceIdAtom } from "states/panel-states";
import { sortDesc } from "@set/utils/dist/array";
import { useTranslations } from "next-intl";

type Props = {
    breadcrumbs: React.ReactNode;
    children: React.ReactNode;
};

const Status = ({ breadcrumbs }: { breadcrumbs: ReactNode }) => {
    const { data: sessionData } = useSession();
    const { data: items } = trpc.race.myRaces.useQuery(undefined, { initialData: [] });
    const router = useRouter();
    const [selectedRaceId, selectRaceId] = useAtom(selectedRaceIdAtom);
    const raceId = useCurrentRaceId() || selectedRaceId;

    useEffect(() => {
        !selectedRaceId && items && items.length && selectRaceId(items[0]?.id);
    }, [items]);

    return (
        <div className="flex items-center bg-gray-50 cursor-default h-20 py-6 min px-8">
            {breadcrumbs}
            <div className="grow"></div>
            {sessionData && (
                <div className="flex items-center mr-4">
                    <PoorSelect2
                        placeholder="Select race"
                        initialValue={raceId}
                        onChange={e => {
                            if (!e.target.value) return;
                            selectRaceId(e.target.value);
                            router.push(`/panel/${e.target.value}`);
                        }}
                        valueKey="id"
                        nameKey="name"
                        items={items}
                    />
                    <img className="ml-4 rounded-full h-8 w-8" src={sessionData.user?.image ?? ""} />
                    <div className="ml-4 flex flex-col">
                        <div className="text-sm">{sessionData.user?.name}</div>
                        <div className="text-2xs font-light">Organizer</div>
                    </div>
                    <div className="mx-8 w-[1px] h-8 flex bg-gray-100"></div>
                    <div
                        className="flex opacity-50 hover:opacity-100 transition-opacity items-center cursor-pointer text-sm"
                        onClick={() => signOut()}
                    >
                        <Icon path={mdiPowerStandby} size={0.5}></Icon>
                        <span className="ml-1">Logout</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const routeMatched = (route: string, currentPath: string) => {
    const reg = new RegExp(`^${route.replaceAll(/:\w+/g, "\\d+")}(\/?\\w*)*$`);
    return reg.test(currentPath);
};

const PageLayout = ({ breadcrumbs, children }: Props) => {
    const pathname = usePathname();

    const [raceId] = useAtom(selectedRaceIdAtom);

    const t = useTranslations();

    const generalMenuGroup = {
        name: t('menuOptions.general.title'),
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
        name: t('menuOptions.admin.title'),
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
        name: t('menuOptions.race.title'),
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

    const menuGroups = [generalMenuGroup, raceMenuGroup, adminMenuGroup];

    const matchedRoutes = menuGroups.flatMap(g => g.items).filter(r => routeMatched(r.to, pathname!));

    const longestMatchedRoute = sortDesc(matchedRoutes, r => r.to.length)[0];

    return (
        <>
            <Demodal.Container />
            <Meta />
            <div className="h-full relative">
                <div className="will-change-transform h-full w-full flex">
                    <div className="flex flex-grow overflow-y-hidden shadow-md">
                        <nav className="w-64 shrink-0 overflow-clip flex-col shadow-lg bg-white z-10">
                            <Link href={"/panel" as Route}>
                                <div className="transition-opacity flex flex-col items-center cursor-pointer text-center px-4 py-4">
                                    <img src="/assets/logo_ravelo_black.png"></img>
                                </div>
                            </Link>
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
                        </nav>
                        <main className="flex flex-col grow h-full overflow-y-auto">
                            <Status breadcrumbs={breadcrumbs} />
                            <div className="px-8 py-4 flex-grow overflow-y-scroll">{children}</div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PageLayout;
