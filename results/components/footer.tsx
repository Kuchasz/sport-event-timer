import classNames from "classnames";
import Icon from "@mdi/react";
import Link from "next/link";
import { Email } from "./email";
import { mdiEmailOpenOutline, mdiHumanMaleChild } from "@mdi/js";
import { menuItems } from "./menu-items";
import { ReactNode } from "react";
import { useRouter } from "next/dist/client/router";

const MenuButton = ({
    activePath = "",
    to,
    children,
    isLast
}: {
    activePath: string;
    to: string;
    children: ReactNode;
    isLast: boolean;
}) => (
    <Link href={to}>
        <button
            className={classNames("font-semibold transition-colors uppercase", {
                ["text-orange-500 "]: to === "/" ? activePath === to : activePath.startsWith(to),
                ["mr-0"]: isLast,
                ["mr-8"]: !isLast
            })}
        >
            {children}
        </button>
    </Link>
);

const Footer = () => {
    const router = useRouter();
    return (
        <footer>
            <div className="flex justify-center py-8 bg-gray-900 text-white">
                <div className="w-full max-w-6xl flex flex-col sm:flex-row text-sm items-center">
                    <img className="mr-10" width="150px" src="/assets/logo-sm.png"></img>
                    <div className="flex-grow text-gray-400">
                        <div className="text-lg">
                            Ambasador <strong>Marta Lach</strong>
                        </div>
                        <div>Mistrzyni Polski, Olimpijka Tokio 2020</div>
                    </div>
                    <div className="flex flex-col sm:flex-row  items-center">
                        <div className="flex">
                            <Icon className="text-orange-500" size={1.5} path={mdiHumanMaleChild}></Icon>
                            <div className="ml-4">
                                <div className="text-gray-700 font-bold">ZAWODY DLA DZIECI</div>
                                <Email>zawodydzieci@rura.cc</Email>
                            </div>
                        </div>
                        <div className="h-1/2 mx-12 w-0.5 bg-gray-700 py-5"></div>
                        <div className="flex">
                            <Icon className="text-orange-500" size={1.5} path={mdiEmailOpenOutline}></Icon>
                            <div className="ml-4">
                                <div className="text-gray-700 font-bold">KONTAKT</div>
                                <Email>biuro@rura.cc</Email>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800 text-gray-600 flex justify-center py-12 text-xs font-semibold">
                <div className="w-full max-w-6xl flex justify-between">
                    <div>RURA NA KOCIERZ © 2022</div>
                    <div>
                        {menuItems.map((mi, i) => (
                            <MenuButton
                                key={mi.path}
                                activePath={router.asPath}
                                to={mi.path}
                                isLast={i + 1 === menuItems.length}
                            >
                                {mi.label}
                            </MenuButton>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
