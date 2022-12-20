import Icon from "@mdi/react";
import classNames from "classnames";
import Link from "next/link";

export const MenuButton = (n: { color: string; text: string; icon: string; to: string; isActive: boolean }) => (
    <Link href={n.to}>
        <div
            className={classNames("py-4 cursor-pointer px-6 flex items-center text-sm", {
                ["bg-slate-100"]: n.isActive,
                ["hover:bg-slate-50"]: !n.isActive,
            })}
        >
            <Icon className={n.color} size={0.8} path={n.icon}></Icon>
            <span className="ml-4">{n.text}</span>
        </div>
    </Link>
);