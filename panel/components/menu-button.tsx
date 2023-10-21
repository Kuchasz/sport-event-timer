import Icon from "@mdi/react";
import classNames from "classnames";
import type { Route } from "next";
import Link from "next/link";

export const MenuButton = (n: { color: string; bg: string; text: string; icon: string; to: Route; isActive: boolean }) => (
    <Link href={n.to}>
        <div
            className={classNames(
                "my-1.5 mr-3 flex cursor-pointer items-center rounded-r-md py-3 pl-6 text-sm font-medium transition-all",
                {
                    [n.bg]: n.isActive,
                    ["text-gray-600 hover:bg-gray-100"]: !n.isActive,
                    [n.color]: n.isActive,
                },
            )}
        >
            <Icon className={classNames("transition-opacity", { ["opacity-50"]: !n.isActive })} size={0.8} path={n.icon}></Icon>
            <span className="ml-2.5">{n.text}</span>
        </div>
    </Link>
);
