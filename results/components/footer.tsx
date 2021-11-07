import classNames from "classnames";
import Link from "next/link";
import { menuItems } from "./menu-items";
import { ReactNode } from "react";
import { useRouter } from "next/dist/client/router";

const MenuButton = ({ activePath = "", to, children }: { activePath: string; to: string; children: ReactNode }) => (
    <Link href={to}>
        <button
            className={classNames("font-semibold transition-colors mr-8 uppercase", {
                ["text-orange-500 "]: to === "/" ? activePath === to : activePath.startsWith(to)
            })}
        >
            {children}
        </button>
    </Link>
);

const Footer = () => {
    const router = useRouter();
    return (
        <footer className="bg-gray-800 text-gray-600 flex justify-center py-12 text-xs font-semibold">
            <div className="w-full max-w-5xl flex justify-between">
                <div>RURA NA KOCIERZ © 2021</div>
                <div>
                    {menuItems.map((mi) => (
                        <MenuButton activePath={router.asPath} to={mi.path}>
                            {mi.label}
                        </MenuButton>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
