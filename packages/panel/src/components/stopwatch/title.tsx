"use client";
import { mdiChevronLeft } from "@mdi/js";
import Icon from "@mdi/react";

import { useRouter } from "next/navigation";

export const Title = ({ text }: { text: string }) => {
    const router = useRouter() as unknown as { back: () => void };
    return (
        <div className="relative z-10 flex w-full items-center bg-white px-1 py-3 shadow-sm will-change-transform">
            <div onClick={router.back} className="absolute">
                <Icon size={1.2} path={mdiChevronLeft}></Icon>
            </div>
            <div className="w-full text-center text-sm font-medium text-black">{text}</div>
        </div>
    );
};
