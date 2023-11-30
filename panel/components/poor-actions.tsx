"use client";

import { Popover } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import Icon from "@mdi/react";
import { mdiDotsHorizontal } from "@mdi/js";
import { type ReactNode } from "react";

type Action<TItem> = {
    name: string;
    description: string;
    iconPath: string;
    execute: (param: TItem) => void;
};

type PoorActionProps = {
    name: string;
    description: string;
    iconPath: string;
};

export const NewPoorActionsItem = ({ name, description, iconPath }: PoorActionProps) => (
    <a
        key={name}
        className="-m-3 flex cursor-pointer items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
            <Icon size={1} className="text-black" path={iconPath} />,
        </div>
        <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    </a>
);

export const NewPoorActions = ({ children }: { children: ReactNode }) => {
    return (
        <Popover className="flex h-full items-center">
            <Float
                transform={false}
                portal
                placement="bottom-end"
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
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-8 bg-white p-7">{children}</div>
                    </div>
                </Popover.Panel>
            </Float>
        </Popover>
    );
};

export const PoorActions = <TItem,>({ item, actions }: { item: TItem; actions: Action<TItem>[] }) => {
    return (
        <Popover className="flex h-full items-center">
            <Float
                transform={false}
                portal
                placement="bottom-end"
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
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative grid gap-8 bg-white p-7">
                            {actions.map(action => (
                                <a
                                    key={action.name}
                                    className="-m-3 flex cursor-pointer items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                                    onClick={() => action.execute(item)}>
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
                                        <Icon size={1} className="text-black" path={action.iconPath} />,
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">{action.name}</p>
                                        <p className="text-sm text-gray-500">{action.description}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </Popover.Panel>
            </Float>
        </Popover>
    );
};
