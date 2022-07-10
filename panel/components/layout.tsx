import Icon from "@mdi/react";
import Link from "next/link";
import {
    mdiAccountCogOutline,
    mdiAccountGroup,
    mdiAlarm,
    mdiBikeFast,
    mdiHome,
    mdiTimetable
    } from "@mdi/js";
import { Meta } from "./meta";

type Props = {
    preview?: boolean;
    children: React.ReactNode;
};

const menuItems = [
    {
        name: "General",
        items: [
            { text: "Home", icon: mdiHome, to: "/", color: "text-yellow-600" },
            { text: "Races", icon: mdiBikeFast, to: "/races", color: "text-red-600" }
        ]
    },
    {
        name: "Race",
        items: [
            { text: "Players", icon: mdiAccountGroup, to: "/players", color: "text-pink-600" },
            { text: "Classifications", icon: mdiAccountCogOutline, to: "/classifications", color: "text-purple-600" },
            { text: "Times", icon: mdiAlarm, to: "/", color: "text-red-600" },
            { text: "Results", icon: mdiTimetable, to: "/", color: "text-blue-600" }
        ]
    },
    {
        name: "Admin",
        items: [
            { text: "Races", icon: mdiBikeFast, to: "/races", color: "text-green-600" },
            { text: "Say hay!", icon: mdiTimetable, to: "/hello", color: "text-red-600" }
        ]
    }
];

const Layout = ({ children }: Props) => {
    return (
        <>
            <Meta />
            <div className="h-full relative bg-gray-100">
                <div className="h-64 w-full absolute top-0 left-0 bg-[#F28C28]"></div>
                <div className="will-change-transform h-full w-full flex flex-col">
                    <div className="flex my-8"></div>
                    <div className="flex flex-grow overflow-y-hidden">
                        <nav className="w-60 py-4 px-6 flex-col shadow-lg rounded-tr-md bg-white">
                            {menuItems.map(mi => (
                                <>
                                    <div className="uppercase py-4 text-2xs">{mi.name}</div>
                                    {mi.items.map(n => (
                                        <Link href={n.to}>
                                            <div className="py-4 flex items-center text-sm">
                                                <Icon className={n.color} size={0.8} path={n.icon}></Icon>
                                                <span className="ml-4">{n.text}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </>
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
