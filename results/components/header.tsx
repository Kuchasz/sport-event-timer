import classNames from "classnames";
import Icon from "@mdi/react";
import Link from "next/link";
import { Email } from "./email";
import {
    mdiEmailOpenOutline,
    mdiFacebook,
    mdiHumanMaleChild,
    mdiMenu
    } from "@mdi/js";
import { menuItems } from "./menu-items";
import { useRouter } from "next/dist/client/router";
import { useState } from "react";

const MenuText = ({ text }: { text: string }) => (
    <span className="text-sm md:text-base font-semibold transition-colors py-1 mx-2 md:mx-5 uppercase">{text}</span>
);

const MenuButton = ({
    onClick,
    activePath = "",
    to,
    text
}: {
    onClick?: () => void;
    activePath: string;
    to: string;
    text: string;
}) => (
    <Link href={to}>
        <button
            onClick={onClick}
            className={classNames({
                ["text-orange-500 "]: to === "/" ? activePath === to : activePath.startsWith(to)
            })}
        >
            <MenuText text={text} />
        </button>
    </Link>
);

export const Header = () => {
    const router = useRouter();
    const [menuRevealed, setMenuRevealed] = useState(false);
    console.log(router.asPath);
    return (
        <header className="flex flex-col">
            <div className="flex justify-center py-4 bg-zinc-900 text-white">
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
                    <div>
                        <a target="_blank" href="https://www.facebook.com/ruranakocierz">
                            <Icon size={1.5} path={mdiFacebook} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="w-full h-0.5 bg-zinc-700"></div>
            </div>
            <div className="flex justify-center py-3 bg-zinc-900 text-white">
                <div className="w-full max-w-6xl flex-col flex">
                    <div className="mx-4 sm:mx-0 flex justify-between">
                        <div className="hidden sm:flex justify-between md:justify-start">
                            {menuItems.map((mi) => (
                                <MenuButton key={mi.path} activePath={router.asPath} to={mi.path} text={mi.label} />
                            ))}
                        </div>
                        <div onClick={() => setMenuRevealed(!menuRevealed)} className="flex sm:hidden items-center">
                            <Icon size={1.5} path={mdiMenu} />
                            <MenuText
                                text={
                                    menuItems.find((mi) =>
                                        mi.path === "/" ? router.asPath === mi.path : router.asPath.startsWith(mi.path)
                                    )?.label ?? "MENU"
                                }
                            />
                        </div>
                        <a
                            target="_blank"
                            href="https://dostartu.pl/rura-na-kocierz-v6591"
                            className="self-center cursor-pointer text-center bg-orange-500 hover:bg-white hover:text-orange-500 font-bold rounded-full px-4 font-mono py-1"
                        >
                            REJESTRACJA
                        </a>
                    </div>
                    <div
                        className={classNames("flex-col ml-2 items-start", menuRevealed ? "flex sm:hidden" : "hidden")}
                    >
                        {menuItems.map((mi) => (
                            <MenuButton
                                onClick={() => setMenuRevealed(false)}
                                key={mi.path}
                                activePath={router.asPath}
                                to={mi.path}
                                text={mi.label}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};
