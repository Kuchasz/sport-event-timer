"use client";

import { Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import Icon from "@mdi/react";
import { mdiDotsHorizontal } from "@mdi/js";
import React, { useEffect, type ReactNode } from "react";

type PoorActionProps = {
    name: string;
    description: string;
    iconPath: string;
    href?: string;
    onClick?: () => void;
};

export const NewPoorActionsItem = ({ name, description, iconPath, href, onClick }: PoorActionProps) => (
    <a
        key={name}
        {...(href ? { href } : null)}
        {...(onClick ? { onClick } : null)}
        className="-m-3 flex cursor-pointer items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-blue-100 text-white">
            <Icon size={1} className="text-blue-700" path={iconPath} />
        </div>
        <div className="ml-4 text-sm font-medium">
            <p className=" text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    </a>
);

const PoorActionsCloser = (props: { close: () => void }) => {
    useEffect(() => {
        const close = props.close;
        window.addEventListener("scroll", close, true);
        return () => {
            window.removeEventListener("scroll", close, true);
        };
    }, [props.close]);
    return null;
};

export const PoorActions = ({ children }: { children: ReactNode }) => {
    return (
        <Popover className="flex h-full items-center">
            <Float
                zIndex={10}
                transform={false}
                autoPlacement
                portal
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1">
                <Popover.Button className="group inline-flex items-center rounded-full px-3 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                    <Icon className="text-black" size={0.8} path={mdiDotsHorizontal} />
                </Popover.Button>
                <Popover.Panel className="mt-3 w-screen max-w-sm px-4 sm:px-0">
                    {({ close }) => (
                        <>
                            <PoorActionsCloser close={close} />
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="relative grid gap-8 bg-white p-7">{children}</div>
                            </div>
                        </>
                    )}
                </Popover.Panel>
            </Float>
        </Popover>
    );
};
