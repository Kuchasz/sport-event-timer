import { getServerSession } from "next-auth";
import { authOptions } from "server/auth";
import { LogoutButton } from "./status-components";
import Link from "next/link";
import { Route } from "next";

export const IndexStatus = async () => {
    const session = await getServerSession(authOptions());

    return (
        <div className="min flex h-20 w-full cursor-default items-center bg-gray-50 px-8 py-6">
            <Link href={"/" as Route}>
                <div className="flex cursor-pointer flex-col items-center px-4 py-4 text-center transition-opacity">
                    <img src="/assets/logo_ravelo_black.png"></img>
                </div>
            </Link>
            <div className="grow"></div>
            {session && (
                <div className="mr-4 flex items-center">
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
