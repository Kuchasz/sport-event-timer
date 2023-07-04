import { ReactNode } from "react";

export const DashboardCard = ({ title, children }: { title: string; children: ReactNode }) => (
    <div className="self-start w-64 h-64 shadow-md m-2 px-6 py-4 rounded-md flex flex-col items-center">
        <div className="self-start font-semibold">{title}</div>
        <div className="w-full h-full flex items-center justify-center">{children}</div>
    </div>
);
