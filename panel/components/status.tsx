import { getServerSession } from "next-auth";
import type { ReactNode } from "react";
import { authOptions } from "server/auth";
import { LogoutButton } from "./status-components";
// import { db } from "server/db";

export const Status = async ({ breadcrumbs }: { breadcrumbs: ReactNode }) => {
    const session = await getServerSession(authOptions());
    // const races = await db.race.findMany({ orderBy: { id: "desc" } })

    return (
        <div className="min flex h-20 cursor-default items-center bg-gray-50 px-8 py-6">
            {breadcrumbs}
            <div className="grow"></div>
            {session && (
                <div className="mr-4 flex items-center">
                    {/* <RaceSelector races={races}/> */}
                    <img className="ml-4 h-8 w-8 rounded-full" src={session.user?.image ?? ""} />
                    <div className="ml-4 flex flex-col">
                        <div className="text-sm">{session.user?.name}</div>
                        <div className="text-2xs font-light">Organizer</div>
                    </div>
                    <div className="mx-8 flex h-8 w-[1px] bg-gray-100"></div>
                    <LogoutButton />
                </div>
            )}
        </div>
    );
};
