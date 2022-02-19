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
            <div className="flex flex-col items-center py-8 bg-gray-100 text-white">
                <div className="text-gray-700 font-semibold text-2xl">ORGANIZATORZY</div>
                <div className="h-1 w-10 bg-orange-500 my-6"></div>
                <div className="max-w-6xl flex flex-wrap justify-center items-center">
                    <img className="scale-75" src="/assets/partners/logo-innergy-racing-team.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-kocierz.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-gmina-lekawica.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-gmina-porabka.png"></img>
                </div>
                <div className="text-gray-700 font-semibold text-2xl mt-20">SPONSORZY</div>
                <div className="h-1 w-10 bg-orange-500 my-6"></div>
                <div className="max-w-6xl flex flex-wrap justify-center items-center">
                    <img className="scale-75" src="/assets/partners/logo-maspex.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-ceratizit.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-decathlon.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-eurowafel.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-czaniecki-makaron.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-agropunkt.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-pbw.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-pkp-cargo-service.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-power-of-science.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-ravelo.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-euro-stempel.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-trek.png"></img>
                </div>
                <div className="text-gray-700 font-semibold text-2xl mt-20">PATRONI MEDIALNI</div>
                <div className="h-1 w-10 bg-orange-500 my-6"></div>
                <div className="max-w-6xl flex flex-wrap justify-center items-center">
                    <img className="scale-75" src="/assets/partners/logo-kolarsko-pl.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-turdetur.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-velonews-pl.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-naszosie-pl.png"></img>
                </div>

                {/* <div className="text-gray-700 font-semibold text-2xl">SPONSORZY</div>
                <div className="h-1 w-10 bg-orange-500 my-6"></div>
                <div className="max-w-6xl flex flex-wrap justify-center items-center">
                    <img className="scale-75" src="/assets/partners/logo-maspex.png"></img>

                    <img className="scale-75" src="/assets/partners/logo-ceratizit.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-decathlon.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-pkp-cargo-service.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-pbw.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-trek.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-czaniecki-makaron.png"></img>

                    <img className="scale-75" src="/assets/partners/logo-kocierz.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-agropunkt.png"></img>

                    <img className="scale-75" src="/assets/partners/logo-eurowafel.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-euro-stempel.png"></img>

                    <img className="scale-75" src="/assets/partners/logo-power-of-science.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-ravelo.png"></img>
                </div>
                <div className="text-gray-700 mt-12 font-semibold text-2xl">PARTNERZY WSPIERAJĄCY</div>
                <div className="h-1 w-10 bg-orange-500 my-6"></div>
                <div className="max-w-6xl flex flex-wrap justify-center items-center">
                    <img className="scale-75" src="/assets/partners/logo-gmina-lekawica.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-gmina-porabka.png"></img>
                </div>
                <div className="text-gray-700 mt-12 font-semibold text-2xl">PATRONAT MEDIALNY</div>
                <div className="h-1 w-10 bg-orange-500 my-6"></div>
                <div className="max-w-6xl flex flex-wrap justify-center items-center">
                    <img className="scale-75" src="/assets/partners/logo-kolarsko-pl.png"></img>
                    <img className="ml-2 scale-75" src="/assets/partners/logo-turdetur.png"></img>
                    <img className="scale-75" src="/assets/partners/logo-velonews-pl.png"></img>
                </div> */}
            </div>
            <div className="flex justify-center py-8 bg-gray-900 text-white">
                <div className="w-full max-w-6xl flex flex-col sm:flex-row text-sm items-center">
                    <Link href="/">
                        <img className="cursor-pointer mr-10" width="150px" src="/assets/logo-sm.png"></img>
                    </Link>
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
