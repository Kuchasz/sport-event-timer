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
    mdiAlarm, mdiBikeFast,
    mdiBriefcaseOutline, mdiCog,
    mdiHomeOutline,
    mdiNumeric,
    mdiPlus,
    mdiPowerStandby,
    mdiTimerCogOutline,
    mdiTimetable,
    mdiViewDashboardEditOutline
} from "@mdi/js";
import { Meta } from "./meta";
import { useCurrentRaceId } from "../hooks";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { MenuButton } from "./menu-button";
import Link from "next/link";
import { PoorSelect2 } from "./poor-select";
import { trpc } from "trpc-core";
import { Demodal } from "demodal";
import { AppRouterInputs } from "trpc";
import { RaceCreate } from "./race-create";
import { NiceModal } from "./modal";
import { ReactNode } from "react";
import { Route } from "next";

type CreatedRace = AppRouterInputs["race"]["add"];
type Props = {
    breadcrumbs: React.ReactNode;
    children: React.ReactNode;
};

const generalMenuGroup = {
    desc: "Your dashboard",
    name: "General",
    icon: mdiHomeOutline,
    color: "bg-[#64b3f4]",
    to: "/panel",
    items: [
        { text: "Dashboard", icon: mdiViewDashboardEditOutline, to: "/panel", color: "text-yellow-600" },
        {
            text: "My Races",
            icon: mdiBikeFast,
            to: "/panel/my-races",
            color: "text-red-600",
        },
    ],
} as const;

const adminMenuGroup = {
    desc: "Admin the system",
    name: "Administrator",
    icon: mdiBriefcaseOutline,
    color: "bg-orange-500",
    to: "/panel/admin",
    items: [
        {
            text: "Dashboard",
            icon: mdiViewDashboardEditOutline,
            to: "/panel/admin",
            color: "text-yellow-600",
        },
        {
            text: "Races",
            icon: mdiBikeFast,
            to: "/panel/admin/races",
            color: "text-green-600",
        },
        {
            text: "Say hay!",
            icon: mdiTimetable,
            to: "/panel/admin/hello",
            color: "text-red-600",
        },
        {
            text: "Accounts",
            icon: mdiAccount,
            to: "/panel/admin/accounts",
            color: "text-pink-600",
        },
    ],
} as const;

const raceMenuGroup = {
    desc: "Manage your races",
    name: "Race",
    icon: mdiAlarm,
    color: "bg-[#c2e59c]",
    to: "/panel/:raceId",
    items: [
        {
            text: "Base Info",
            icon: mdiViewDashboardEditOutline,
            to: "/panel/:raceId",
            color: "text-yellow-600",
        },
        {
            text: "Bib Numbers",
            icon: mdiNumeric,
            to: "/panel/:raceId/bib-numbers",
            color: "text-green-600",
        },
        {
            text: "Players",
            icon: mdiAccountGroup,
            to: "/panel/:raceId/players",
            color: "text-pink-600",
        },
        {
            text: "Registrations",
            icon: mdiAccountGroup,
            to: "/panel/:raceId/player-registrations",
            color: "text-yellow-600",
        },
        {
            text: "Classifications",
            icon: mdiAccountCogOutline,
            to: "/panel/:raceId/classifications",
            color: "text-purple-600",
        },
        {
            text: "Timing Points",
            icon: mdiTimerCogOutline,
            to: "/panel/:raceId/timing-points",
            color: "text-lime-600",
        },
        {
            text: "Split Times",
            icon: mdiAlarm,
            to: "/panel/:raceId/split-times",
            color: "text-red-600",
        },
        {
            text: "Results",
            icon: mdiTimetable,
            to: "/panel/:raceId/results",
            color: "text-blue-600",
        },
        {
            text: "Settings",
            icon: mdiCog,
            to: "/panel/:raceId/settings",
            color: "text-orange-600",
        },
    ],
} as const;

const Status = ({ breadcrumbs }: { breadcrumbs: ReactNode }) => {
    const { data: sessionData } = useSession();

    return (
        <div className="flex items-center cursor-default py-6 px-8">
            {/* <div className="uppercase text-md font-semibold flex"> */}
                {breadcrumbs}
                {/* {segments.map((s, id) => (
                    <div key={s} className="flex items-center">
                        {id === 0 ? (
                            <Icon className="text-gray-500" size={1} path={mdiHomeOutline} />
                        ) : (
                            <>
                                <Icon className="mx-2 text-gray-500" size={1} path={mdiChevronRight} />
                                {s}
                            </>
                        )}
                    </div>
                ))} */}
            {/* </div> */}
            <div className="grow"></div>
            {sessionData && (
                <div className="flex items-center mr-4">
                    <img className="rounded-full h-8 w-8" src={sessionData.user?.image ?? ""} />
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

const PageLayout = ({ breadcrumbs, children }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data: items, refetch } = trpc.race.myRaces.useQuery(undefined, { initialData: [] });

    const raceId = useCurrentRaceId() || items[0]?.id;

    const addRaceMuttaion = trpc.race.add.useMutation();

    // const { query: { raceId }} = router;

    const currentMenuGroup = pathname!.includes(raceMenuGroup.to.replace(":raceId", String(raceId)))
        ? raceMenuGroup
        : pathname!.includes(adminMenuGroup.to.replace(":raceId", String(raceId)))
        ? adminMenuGroup
        : generalMenuGroup;

    // const currentMenuItem = currentMenuGroup.items.find(n => router.asPath === n.to.replace(":raceId", String(raceId)));

    const menuGroups = [generalMenuGroup, raceMenuGroup, adminMenuGroup];
    const menuItems = currentMenuGroup.items;

    const openCreateDialog = async () => {
        const race = await Demodal.open<CreatedRace>(NiceModal, {
            title: "Create new race",
            component: RaceCreate,
            props: {},
        });

        if (race) {
            await addRaceMuttaion.mutateAsync(race);
            refetch();
        }
    };

    // const menuItems = [generalMenuItems, raceMenuItems, adminMenuItems];

    return (
        <>
            <Demodal.Container />
            <Meta />
            <div className="h-full relative">
                {/* <div className="h-64 w-full absolute top-0 left-0 bg-gradient-to-r from-[#c2e59c] to-[#64b3f4]"></div> */}
                <div className="will-change-transform h-full w-full flex">
                    {/* <Status /> */}

                    <div className="flex flex-grow overflow-y-hidden shadow-md">
                        <nav className="shrink-0 flex-col shadow-lg text-white bg-[#11212B] z-20">
                            <Link href={"/panel" as Route}>
                                <div className="transition-opacity cursor-pointer text-center px-4 py-4 text-3xl">r</div>
                            </Link>
                            <div className="flex-grow h-full justify-center flex flex-col">
                                {menuGroups.map(mg => (
                                    <Link key={mg.to} href={mg.to.replace(":raceId", String(raceId)) as Route}>
                                        <div
                                            key={mg.desc}
                                            className={`transition-opacity cursor-pointer uppercase p-2 mx-3 my-4 rounded-xl text-2xs ${
                                                currentMenuGroup.desc === mg.desc
                                                    ? `bg-[#0b161d] opacity-100`
                                                    : "opacity-30 hover:opacity-50"
                                            }`}
                                        >
                                            <Icon path={mg.icon} size={1}></Icon>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </nav>
                        <nav className="w-52 shrink-0 overflow-clip flex-col shadow-lg bg-white z-10">
                            {/* <div className="pt-4 pb-12 flex justify-center">
                                <img className="invert" src="/assets/logo_ravelo.png" />
                            </div> */}

                            <div className="py-6 px-6 font-semibold text-xl">{currentMenuGroup.desc}</div>

                            {currentMenuGroup.desc === raceMenuGroup.desc ? (
                                <div className="w-full flex flex-col my-8 items-center">
                                    <div
                                        className="flex-shrink-0 w-6 ml-2 hidden mr-2 opacity-60 cursor-pointer hover:opacity-100 text-gray-600"
                                        onClick={openCreateDialog}
                                    >
                                        <Icon size={1} path={mdiPlus}></Icon>
                                    </div>
                                    <PoorSelect2
                                        placeholder="Select race"
                                        initialValue={raceId}
                                        onChange={e => {
                                            // selectRace(e.target.value);
                                            router.push(`/panel/${e.target.value}` as Route);
                                        }}
                                        valueKey="id"
                                        nameKey="name"
                                        items={items}
                                    />
                                </div>
                            ) : null}

                            {(currentMenuGroup.desc === raceMenuGroup.desc && raceId) || currentMenuGroup.desc !== raceMenuGroup.desc
                                ? menuItems.map(n => (
                                      <MenuButton
                                          key={n.to}
                                          {...n}
                                          to={n.to.replace(":raceId", String(raceId)) as Route}
                                          isActive={pathname === n.to.replace(":raceId", String(raceId))}
                                      />
                                  ))
                                : null}
                        </nav>
                        <main className="flex flex-col grow h-full overflow-y-auto">
                            <Status breadcrumbs={breadcrumbs}/>
                            <div className="px-8 pb-4 flex-grow overflow-y-scroll">{children}</div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PageLayout;
