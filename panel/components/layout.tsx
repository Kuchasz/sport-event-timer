import Icon from "@mdi/react";
import { Button } from "./button";
import { Demodal } from "demodal";
import { Fragment } from "react";
import {
    mdiAccountCogOutline,
    mdiAccountGroup,
    mdiAlarm,
    mdiBikeFast,
    mdiCog,
    mdiHome,
    mdiLogout,
    mdiPlus,
    mdiTimerCogOutline,
    mdiTimetable,
} from "@mdi/js";
import { Meta } from "./meta";
import { NiceModal } from "./modal";
import { PoorSelect } from "./poor-select";
import { RaceCreate } from "./race-create";
import { useCurrentRaceId } from "../hooks";
import { useRouter } from "next/router";
import { AppRouterInputs } from "trpc";
import { trpc } from "connection";
import { signOut, useSession } from "next-auth/react";
import { MenuButton } from "./menu-button";

type Props = {
    preview?: boolean;
    children: React.ReactNode;
};

type CreatedRace = AppRouterInputs["race"]["add"];
const generalMenuItems = {
    name: "General",
    items: [
        { text: "Home", icon: mdiHome, to: "/panel/", color: "text-yellow-600" },
        {
            text: "My Races",
            icon: mdiBikeFast,
            to: "/panel/my-races",
            color: "text-red-600",
        },
    ],
};

const adminMenuItems = {
    name: "Admin",
    items: [
        {
            text: "Races",
            icon: mdiBikeFast,
            to: "/panel/races",
            color: "text-green-600",
        },
        {
            text: "Say hay!",
            icon: mdiTimetable,
            to: "/panel/hello",
            color: "text-red-600",
        },
    ],
};

const raceMenuItems = {
    name: "Race",
    items: [
        {
            text: "Players",
            icon: mdiAccountGroup,
            to: "/panel/:raceId/players",
            color: "text-pink-600",
        }, {
            text: "Player Registrations",
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
            color: "text-red-600" 
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
            color: "text-orange-600"
        }
    ],
};

const Status = () => {
    const { data: sessionData } = useSession();

    const router = useRouter();
    const { data: items, refetch } = trpc.race.races.useQuery();
    const addRaceMuttaion = trpc.race.add.useMutation();
    const raceId = useCurrentRaceId();

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

    return (
        <div className="flex items-center my-4 px-4 text-white">
            <img src="/assets/logo_ravelo.png" />
            <div className="grow"></div>
            <div className="w-64 text-gray-800 will-change-transform z-10 mr-4">
                {items && items.length > 0 ? (
                    <PoorSelect
                        nameKey="name"
                        valueKey="id"
                        placeholder="Select race"
                        initialValue={raceId}
                        items={items}
                        onChange={(e) => {
                            // selectRace(e.target.value);
                            router.push(`/panel/${e.target.value}`);
                        }}
                    ></PoorSelect>
                ) : null}
            </div>
            {sessionData && (
                <Button onClick={openCreateDialog}>
                    <Icon size={1} path={mdiPlus} />
                    <span className="ml-2">Create Race</span>
                </Button>
            )}
            <div className="grow"></div>
            {sessionData && (
                <div className="flex items-center mr-4">
                    <img className="rounded-full h-12 w-12" src={sessionData.user?.image ?? ""} />
                    <div className="ml-4 flex flex-col">
                        <div className="font-semibold">{sessionData.user?.name}</div>
                        <div className="text-xs font-light">Organizer</div>
                    </div>
                    <div className="ml-4 flex cursor-pointer" onClick={() => signOut()}>
                        <Icon path={mdiLogout} size={1}></Icon>
                        <span>Logout</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const Layout = ({ children }: Props) => {
    const router = useRouter();
    const raceId = useCurrentRaceId();

    const menuItems = raceId ? [generalMenuItems, raceMenuItems, adminMenuItems] : [generalMenuItems, adminMenuItems];

    return (
        <>
            <Meta />
            <div className="h-full relative bg-gray-100">
                <div className="h-64 w-full absolute top-0 left-0 bg-gradient-to-r from-[#c2e59c] to-[#64b3f4]"></div>
                <div className="will-change-transform h-full w-full flex flex-col">
                    <Status />
                    <div className="flex flex-grow overflow-y-hidden">
                        <nav className="w-60 shrink-0 py-4 flex-col shadow-lg rounded-tr-md bg-white">
                            {menuItems.map((mi) => (
                                <Fragment key={mi.name}>
                                    <div className="uppercase px-6 py-4 text-2xs">{mi.name}</div>
                                    {mi.items.map((n) => (
                                        <MenuButton key={n.to} {...n} to={n.to.replace(":raceId", String(raceId))} isActive={router.asPath === n.to} />
                                    ))}
                                </Fragment>
                            ))}
                        </nav>
                        <main className="grow h-full overflow-y-auto p-8">
                            <div className="p-4 h-full bg-white rounded-md shadow-md">{children}</div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Layout;
