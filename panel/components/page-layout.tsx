import { Meta } from "./meta";
import Link from "next/link";
import { Route } from "next";
import { Status } from "./status";
import { Menu } from "./menu";
import { AgGridProvider } from "./ag-grid-provider";

type Props = {
    breadcrumbs: React.ReactNode;
    children: React.ReactNode;
};

export const PageLayout = ({ breadcrumbs, children }: Props) => {
    return (
        <>
            <Meta />
            <div className="h-full relative">
                <div className="will-change-transform h-full w-full flex">
                    <div className="flex flex-grow overflow-y-hidden shadow-md">
                        <nav className="w-64 shrink-0 overflow-clip flex-col shadow-lg bg-white z-10">
                            <Link href={"/panel" as Route}>
                                <div className="transition-opacity flex flex-col items-center cursor-pointer text-center px-4 py-4">
                                    <img src="/assets/logo_ravelo_black.png"></img>
                                </div>
                            </Link>
                            <Menu />
                        </nav>
                        <main className="flex flex-col grow h-full overflow-y-auto">
                            <Status breadcrumbs={breadcrumbs} />
                            <div className="px-8 py-4 flex-grow overflow-y-scroll">
                                <AgGridProvider>{children}</AgGridProvider>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};
