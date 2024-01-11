"use client";
import { mdiChevronLeft } from "@mdi/js";
import Icon from "@mdi/react";

import { useRouter } from "next/navigation";

export const Title = ({ text }: { text: string }) => {
    const router = useRouter() as unknown as { back: () => void };
    return (
        <div className="relative flex w-full items-center bg-white px-1 py-4">
            <div onClick={router.back} className="absolute">
                <Icon size={1.5} path={mdiChevronLeft}></Icon>
            </div>
            <div className="w-full text-center font-semibold">{text}</div>
        </div>
    );
};