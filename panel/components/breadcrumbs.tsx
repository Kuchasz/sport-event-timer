import { mdiChevronRight, mdiHomeOutline } from "@mdi/js";
import Icon from "@mdi/react";
import type { Route } from "next";
import Link from "next/link";
import React from "react";
import { ReactNode } from "react";

type BreadcrumbItemProps<T extends string> = { text: string; href: Route<T> | URL };

const BreadcrumbItem = <T extends string>({ text, href }: BreadcrumbItemProps<T>) => (
    <div className="flex text-gray-500 items-center">
        <Icon className="mx-1" size={0.8} path={mdiChevronRight} />
        <Link className="hover:text-gray-700 hover:bg-gray-100 transition-colors px-2 py-1 rounded-md" href={href as Route}>
            {text}
        </Link>
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
        <div className="uppercase text-xs font-semibold flex">
            <div className="flex items-center text-gray-500">
                <Link href="/panel">
                    <Icon className="hover:text-gray-700 cursor-pointer transition-colors rounded-md" size={0.8} path={mdiHomeOutline} />
                </Link>
            </div>
            {children}
        </div>
    );
};

Breadcrumbs.Item = BreadcrumbItem;
