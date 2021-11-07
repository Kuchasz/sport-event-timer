import classNames from "classnames";
import Icon from "@mdi/react";
import Link from "next/link";
import { mdiEmailOpenOutline, mdiFacebook, mdiHumanMaleChild } from "@mdi/js";
import { menuItems } from "./menu-items";
import { ReactNode } from "react";
import { useRouter } from "next/dist/client/router";

const MenuButton = ({ activePath = "", to, children }: { activePath: string; to: string; children: ReactNode }) => (
    <Link href={to}>
        <button
            className={classNames("text-sm font-semibold transition-colors px-2 py-1 mr-10 uppercase", {
                ["text-orange-500 "]: to === "/" ? activePath === to : activePath.startsWith(to)
            })}
        >
            {children}
        </button>
    </Link>
);

const Email = ({ children }: { children: string }) => (
    <a className="hover:text-orange-500 transition-colors" href={`mailto:${children}`}>
        {children}
    </a>
);

const Header = () => {
    const router = useRouter();
    return (
        <header className="flex flex-col">
            <div className="bg-gray-800 text-gray-600 flex justify-center py-3 text-sm font-semibold">
                <div className="w-full max-w-5xl flex">
                    <span className="mr-8">Rura na kocierz</span>
                    <span className="mr-8">09-10/04/2022</span>
                    <span className="mr-8">Jazda indywidualna na czas</span>
                    <span className="mr-8">Wyścig ze startu wspólnego</span>
                </div>
            </div>
            <div className="flex justify-center py-8 bg-gray-900 text-white">
                <div className="w-full max-w-5xl flex text-sm items-center">
                    <img className="mr-40" width="150px" src="assets/logo-sm.png"></img>
                    <div className="flex">
                        <Icon className="text-orange-500" size={1.5} path={mdiHumanMaleChild}></Icon>
                        <div className="ml-4">
                            <div className="text-gray-700 font-bold">ZAWODY DLA DZIECI</div>
                            <Email>zawodydzieci@rura.cc</Email>
                        </div>
                    </div>
                    <div className="h-1/2 mx-12 w-0.5 bg-gray-700"></div>
                    <div className="flex">
                        <Icon className="text-orange-500" size={1.5} path={mdiEmailOpenOutline}></Icon>
                        <div className="ml-4">
                            <div className="text-gray-700 font-bold">KONTAKT</div>
                            <Email>biuro@rura.cc</Email>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="w-full h-0.5 bg-gray-700"></div>
            </div>
            <div className="flex justify-center py-3 bg-gray-900 text-white">
                <div className="w-full max-w-5xl flex justify-between">
                    <div>
                        {menuItems.map((mi) => (
                            <MenuButton key={mi.path} activePath={router.asPath} to={mi.path}>
                                {mi.label}
                            </MenuButton>
                        ))}
                    </div>
                    <div>
                        <a target="_blank" href="https://www.facebook.com/ruranakocierz">
                            <Icon size={1} path={mdiFacebook} />
                        </a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
