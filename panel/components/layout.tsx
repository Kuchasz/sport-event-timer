import classNames from "classnames";
import Icon from "@mdi/react";
import Link from "next/link";
import { Button } from "react-daisyui";
import { CurrentRaceContext } from "../current-race-context";
import {
  mdiAccountCogOutline,
  mdiAccountGroup,
  mdiAlarm,
  mdiBikeFast,
  mdiHome,
  mdiPlus,
  mdiTimetable
  } from "@mdi/js";
import { Meta } from "./meta";
import { RaceCreateFull } from "./race-create-full";
import { Select } from "./select";
import { trpc } from "../trpc";
import { useCallback, useContext } from "react";
import { useRouter } from "next/router";

type Props = {
    preview?: boolean;
    children: React.ReactNode;
};

const menuItems = [
    {
        name: "General",
        items: [
            { text: "Home", icon: mdiHome, to: "/", color: "text-yellow-600" },
            {
                text: "My Races",
                icon: mdiBikeFast,
                to: "/my_races",
                color: "text-red-600"
            }
        ]
    },
    {
        name: "Race",
        items: [
            {
                text: "Players",
                icon: mdiAccountGroup,
                to: "/players",
                color: "text-pink-600"
            },
            {
                text: "Classifications",
                icon: mdiAccountCogOutline,
                to: "/classifications",
                color: "text-purple-600"
            },
            { text: "Times", icon: mdiAlarm, to: "/times", color: "text-red-600" },
            {
                text: "Results",
                icon: mdiTimetable,
                to: "/results",
                color: "text-blue-600"
            }
        ]
    },
    {
        name: "Admin",
        items: [
            {
                text: "Races",
                icon: mdiBikeFast,
                to: "/races",
                color: "text-green-600"
            },
            {
                text: "Say hay!",
                icon: mdiTimetable,
                to: "/hello",
                color: "text-red-600"
            }
        ]
    }
];

const optionZero = { name: "Select race", id: 0 };

const Status = () => {
    const { data: items } = trpc.useQuery(["race.races"]);
    const { selectRace } = useContext(CurrentRaceContext);

    return (
        <div className="flex items-center my-4 px-4 text-white">
            <img src="assets/logo_ravelo.png" />
            <div className="grow"></div>
            <div className="w-64 text-gray-800 will-change-transform z-10 mr-4">
                {items && items.length > 0 ? (
                    <Select
                        initialValue={optionZero}
                        nameKey="name"
                        items={items}
                        onChange={e => {
                            selectRace(e.id);
                        }}
                    ></Select>
                ) : null}
            </div>
            <RaceCreateFull />
            <div className="grow"></div>
            <div className="flex items-center mr-4">
                <img className="rounded-full h-12 w-12" src="assets/typical_system_admin.png" />
                <div className="ml-4 flex flex-col">
                    <div className="font-semibold">Andre Somersby</div>
                    <div className="text-xs font-light">Organizer</div>
                </div>
            </div>
        </div>
    );
};

const MenuButton = (n: { color: string; text: string; icon: string; to: string; isActive: boolean }) => (
    <Link href={n.to}>
        <div
            className={classNames("py-4 cursor-pointer px-6 flex items-center text-sm", {
                ["bg-slate-100"]: n.isActive,
                ["hover:bg-slate-50"]: !n.isActive
            })}
        >
            <Icon className={n.color} size={0.8} path={n.icon}></Icon>
            <span className="ml-4">{n.text}</span>
        </div>
    </Link>
);

const Layout = ({ children }: Props) => {
    const router = useRouter();
    const { raceId } = useContext(CurrentRaceContext);
    return (
        <>
            <Meta />
            <div className="h-full relative bg-gray-100">
                <div className="h-64 w-full absolute top-0 left-0 bg-gradient-to-r from-[#c2e59c] to-[#64b3f4]"></div>
                <div className="will-change-transform h-full w-full flex flex-col">
                    <Status />
                    {raceId && (
                        <div className="flex flex-grow overflow-y-hidden">
                            <nav className="w-60 py-4 flex-col shadow-lg rounded-tr-md bg-white">
                                {menuItems.map(mi => (
                                    <>
                                        <div className="uppercase px-6 py-4 text-2xs">{mi.name}</div>
                                        {mi.items.map(n => (
                                            <MenuButton key={n.to} {...n} isActive={router.asPath === n.to} />
                                        ))}
                                    </>
                                ))}
                            </nav>
                            <main className="grow h-full overflow-y-auto p-8">
                                <div className="p-4 h-full bg-white rounded-md shadow-md">{children}</div>
                            </main>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Layout;
