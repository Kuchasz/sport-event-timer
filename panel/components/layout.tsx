import Icon from "@mdi/react";
import Link from "next/link";
import {
    mdiAccountCogOutline,
    mdiAccountGroup,
    mdiAlarm,
    mdiHome,
    mdiTimetable
    } from "@mdi/js";
import { Meta } from "./meta";

type Props = {
    preview?: boolean;
    children: React.ReactNode;
};

const navItems = [
    { text: "Home", icon: mdiHome, to: "/" },
    { text: "Players", icon: mdiAccountGroup, to: "/players" },
    { text: "Classifications", icon: mdiAccountCogOutline, to: "/classifications" },
    { text: "Times", icon: mdiAlarm, to: "/" },
    { text: "Results", icon: mdiTimetable, to: "/" }
];

const Layout = ({ children }: Props) => {
    return (
        <>
            <Meta />
            <div className="flex h-full bg-gray-100">
                <nav className="w-52 flex-col shadow-lg bg-white">
                    <div className="text-center p-4">@set/panel</div>
                    <div className="px-4">
                        {navItems.map(n => (
                            <Link href={n.to}>
                                <div className="py-4 flex font-semibold">
                                    <Icon size={1} path={n.icon}></Icon>
                                    <span className="ml-2">{n.text}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </nav>
                <main className="grow h-full overflow-y-auto p-8">
                    <div className="p-4 h-full bg-white rounded-md shadow-md">{children}</div>
                </main>
            </div>
        </>
    );
};

export default Layout;
