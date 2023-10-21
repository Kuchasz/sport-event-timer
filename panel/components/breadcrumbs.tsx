import { mdiChevronRight, mdiHomeOutline } from "@mdi/js";
import Icon from "@mdi/react";
import type { Route } from "next";
import Link from "next/link";
import React from "react";
import { ReactNode } from "react";

type BreadcrumbItemProps<T extends string> = { text: string; href?: Route<T> | URL };

const BreadcrumbItem = <T extends string>({ text, href }: BreadcrumbItemProps<T>) => (
    <div className="flex items-center text-gray-400 last:text-gray-800">
        <Icon className="mx-1" size={0.8} path={mdiChevronRight} />
        {href ? (
            <Link className="rounded-md px-2 py-1 transition-colors hover:bg-gray-200 hover:text-gray-800" href={href as Route}>
                {text}
            </Link>
        ) : (
            <span className="select-none px-2 py-1">{text}</span>
        )}
    </div>
);

export const Breadcrumbs = ({ children }: { children?: ReactNode }) => {
    const areValidChildren = (children: ReactNode): children is React.ReactElement<BreadcrumbItemProps<string>>[] => {
        return !!children || React.Children.toArray(children).every(child => React.isValidElement(child) && child.type === BreadcrumbItem);
    };

    if (!areValidChildren(children)) {
        throw new Error("Breadcrumbs should have BreadcrumbItem children.");
    }

    return (
        <div className="flex text-xs font-semibold uppercase">
            <div className="mx-1 flex items-center">
                <Link href="/panel">
                    <Icon className="cursor-pointer rounded-md text-gray-700 transition-colors" size={0.8} path={mdiHomeOutline} />
                </Link>
            </div>
            {children}
        </div>
    );
};

Breadcrumbs.Item = BreadcrumbItem;
