import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { authOptions } from "server/auth";
import { LogoutButton } from "./status-components";
// import { db } from "server/db";

export const Status = async ({ breadcrumbs }: { breadcrumbs: ReactNode }) => {
    const session = await getServerSession(authOptions());
    // const races = await db.race.findMany({ orderBy: { id: "desc" } })

    return (
        <div className="flex items-center bg-gray-50 cursor-default h-20 py-6 min px-8">
            {breadcrumbs}
            <div className="grow"></div>
            {session && (
                <div className="flex items-center mr-4">
                    {/* <RaceSelector races={races}/> */}
                    <img className="ml-4 rounded-full h-8 w-8" src={session.user?.image ?? ""} />
                    <div className="ml-4 flex flex-col">
                        <div className="text-sm">{session.user?.name}</div>
                        <div className="text-2xs font-light">Organizer</div>
                    </div>
                    <div className="mx-8 w-[1px] h-8 flex bg-gray-100"></div>
                    <LogoutButton />
                </div>
            )}
        </div>
    );
};
