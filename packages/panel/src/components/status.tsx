import { getServerSession } from "../auth/index";
import { LogoutButton } from "./status-components";
import Avatar from "boring-avatars";

export const Status = async ({ breadcrumbs }: { breadcrumbs: React.ReactNode }) => {
    const session = await getServerSession();

    return (
        <div className="z-10 flex cursor-default items-center px-8 py-4 shadow-sm">
            {breadcrumbs}
            <div className="grow"></div>
            {session && (
                <div className="mr-4 flex items-center">
                    <Avatar name={session.name} size={32} colors={["#7dd3fc", "#0ea5e9", "#9ca3af"]}></Avatar>
                    <div className="ml-4 flex flex-col">
                        <div className="text-sm font-semibold text-gray-600">{session.name}</div>
                        <div className="text-2xs text-gray-500">Organizer</div>
                    </div>
                    <div className="mx-6 flex h-8 w-[1px] bg-gray-100"></div>
                    <LogoutButton />
                </div>
            )}
        </div>
    );
};
