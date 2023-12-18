"use client";

import { mdiPowerStandby } from "@mdi/js";
import Icon from "@mdi/react";
import { useRouter } from "next/navigation";
import { trpc } from "trpc-core";

export const LogoutButton = () => {
    const logoutMutation = trpc.user.logout.useMutation();
    const router = useRouter();
    return (
        <div
            className="flex cursor-pointer items-center text-sm opacity-50 transition-opacity hover:opacity-100"
            onClick={async () => {
                await logoutMutation.mutateAsync();
                router.push("/id/login");
            }}>
            <Icon path={mdiPowerStandby} size={0.5}></Icon>
            <span className="ml-1">Logout</span>
        </div>
    );
};
