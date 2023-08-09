import Icon from "@mdi/react";
import classNames from "classnames";
import { Route } from "next";
import Link from "next/link";

export const MenuButton = (n: { color: string; bg: string; text: string; icon: string; to: Route; isActive: boolean }) => (
    <Link href={n.to}>
        <div
            className={classNames("my-1.5 py-3 mx-4 px-4 transition-colors rounded-xl cursor-pointer font-medium flex items-center text-sm", {
                [n.bg]: n.isActive,
                ["hover:bg-gray-100 opacity-80"]: !n.isActive,
                [n.color]: n.isActive,
            })}
        >
            <Icon className={classNames('transition-opacity', { ["opacity-40"]: !n.isActive })} size={0.8} path={n.icon}></Icon>
            <span className="ml-3">{n.text}</span>
        </div>
    </Link>
);
