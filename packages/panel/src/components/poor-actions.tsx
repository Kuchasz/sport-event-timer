"use client";

import { mdiDotsHorizontal } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

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
        <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-blue-100 text-white">
            <Icon size={1} className="text-blue-700" path={iconPath} />
        </div>
        <div className="ml-4 text-sm font-medium">
            <p className=" text-gray-900">{name}</p>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    </a>
);

// const PoorActionsCloser = ({ close }: { close: () => void }) => {
//     useEffect(() => {
//         const handleClose = () => {
//             const anyDialogOpen = document.querySelector("[data-radix-popper-content-wrapper]");
//             if (!anyDialogOpen) close();
//         };
//         window.addEventListener("scroll", handleClose, true);
//         return () => {
//             window.removeEventListener("scroll", handleClose, true);
//         };
//     }, [close]);
//     return null;
// };

export const PoorActions = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Icon className="text-black" size={0.8} path={mdiDotsHorizontal} />
            </PopoverTrigger>
            <PopoverContent>
                {/* <PoorActionsCloser close={() => setOpen(false)} /> */}
                <div className="flex flex-col gap-8 p-1">{children}</div>
            </PopoverContent>
        </Popover>
    );
};
