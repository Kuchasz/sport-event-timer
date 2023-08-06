import { mdiChevronRight, mdiHomeOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";
import { ReactNode } from "react";

type BreadcrumbItemProps = { text: string };

const BreadcrumbItem = ({ text }: BreadcrumbItemProps) => (
    <div className="flex items-center">
        <Icon className="mx-2 text-gray-500" size={1} path={mdiChevronRight} />
        {text}
    </div>
);

export const Breadcrumbs = ({ children }: { children?: ReactNode }) => {
    const areValidChildren = (children: ReactNode): children is React.ReactElement<BreadcrumbItemProps>[] => {
        return !!children || React.Children.toArray(children).every(child => React.isValidElement(child) && child.type === BreadcrumbItem);
    };

    if (!areValidChildren(children)) {
        throw new Error("Breadcrumbs should have BreadcrumbItem children.");
    }

    return (
        <div className="uppercase text-xs font-semibold flex">
            <div className="flex items-center">
                <Icon className="text-gray-500" size={1} path={mdiHomeOutline} />
                {/* <Icon className="mx-2 text-gray-500" size={1} path={mdiChevronRight} /> */}
            </div>
            {children}
            {/* <div className="flex items-center">admin</div>
            <div className="flex items-center">
                <Icon className="mx-2 text-gray-500" size={1} path={mdiChevronRight} />
                hello
            </div> */}
        </div>
    );
};

Breadcrumbs.Item = BreadcrumbItem;