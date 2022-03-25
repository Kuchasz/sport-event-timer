import classNames from "classnames";
import Icon from "@mdi/react";
import Link from "next/link";
import { Email } from "./email";
import { mdiEmailOpenOutline, mdiFacebook, mdiHumanMaleChild } from "@mdi/js";
import { menuItems } from "./menu-items";
import { ReactNode } from "react";
import { useRouter } from "next/dist/client/router";

const MenuButton = ({ activePath = "", to, children }: { activePath: string; to: string; children: ReactNode }) => (
    <Link href={to}>
        <button
            className={classNames("text-sm md:text-base font-semibold transition-colors py-1 mx-2 md:mx-5 uppercase", {
                ["text-orange-500 "]: to === "/" ? activePath === to : activePath.startsWith(to)
            })}
        >
            {children}
        </button>
    </Link>
);

export const Header = () => {
    const router = useRouter();
    return (
        <header className="flex flex-col">
            <div className="flex justify-center py-4 md:py-8 bg-zinc-900 text-white">
                <div className="w-full max-w-6xl flex flex-col sm:flex-row text-sm items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/">
                            <img className="cursor-pointer mr-2 md:mr-10" width="200px" src="/assets/logo-sm.png"></img>
                        </Link>
                        <div className="grow text-zinc-400">
                            <div className="text-base">
                                Ambasador <strong>Marta Lach</strong>
                            </div>
                            <div className="text-2xs">Mistrzyni Polski, Olimpijka Tokio 2020</div>
                        </div>
                    </div>
                    <div className="flex items-center my-3 md:my-0">
                        <Icon className="text-orange-500" size={1.5} path={mdiHumanMaleChild}></Icon>
                        <div className="ml-4">
                            <div className="text-zinc-700 font-bold">ZAWODY DLA DZIECI</div>
                            <Email>zawodydzieci@rura.cc</Email>
                        </div>
                        <div className="h-8 inline-block mx-4 md:mx-12 w-0.5 bg-zinc-700"></div>
                        <Icon className="text-orange-500" size={1.5} path={mdiEmailOpenOutline}></Icon>
                        <div className="ml-4">
                            <div className="text-zinc-700 font-bold">KONTAKT</div>
                            <Email>biuro@rura.cc</Email>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="w-full h-0.5 bg-zinc-700"></div>
            </div>
            <div className="flex justify-center py-3 bg-zinc-900 text-white">
                <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between">
                    <div className="flex justify-between md:justify-start">
                        {menuItems.map((mi) => (
                            <MenuButton key={mi.path} activePath={router.asPath} to={mi.path}>
                                {mi.label}
                            </MenuButton>
                        ))}
                    </div>
                    <a
                        target="_blank"
                        href="https://dostartu.pl/rura-na-kocierz-v6591"
                        className="self-center cursor-pointer text-center bg-orange-500 hover:bg-white hover:text-orange-500 font-bold rounded-full px-4 font-mono py-1"
                    >
                        REJESTRACJA
                    </a>
                    {/* <div>
                        <a target="_blank" href="https://www.facebook.com/ruranakocierz">
                            <Icon size={1} path={mdiFacebook} />
                        </a>
                    </div> */}
                </div>
            </div>
        </header>
    );
};
