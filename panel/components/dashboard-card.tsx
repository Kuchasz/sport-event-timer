import classNames from "classnames";
import { ReactNode } from "react";

const Card = ({ title, value, children }: { title: string; value: string; children: ReactNode }) => (
    <div className="self-start overflow-clip w-48 h-32 shadow-sm m-3 p-4 rounded-md flex border border-gray-100 flex-col items-center">
        <div className="text-xs uppercase self-start font-medium text-gray-500">{title}</div>
        <div className="text-lg my-2 shrink uppercase self-start font-medium">{value}</div>
        <div className="w-full h-full grow flex flex-col justify-center items-center">{children}</div>
    </div>
);

const Range = ({ title, min, max }: { title: string; min: number; max?: number | null }) => (
    <Card value={max ? `${min} / ${max}` : min.toString()} title={title}>
        <div className="relative w-full rounded h-2 bg-gray-100">
            {max && (
                <div
                    style={{ width: `${Math.min((min / max) * 100, 100)}%` }}
                    className={classNames(`absolute rounded h-2`, {
                        ["bg-red-500"]: min > max,
                        ["bg-orange-500"]: min === max,
                        ["bg-green-500"]: min < max,
                    })}
                ></div>
            )}
        </div>
    </Card>
);

const Discrete = ({ title, enabled }: { title: string; enabled: boolean }) => (
    <Card value={`${enabled ? "enabled" : "disabled"}`} title={title}>
        <div
            className={classNames("relative w-1/2 rounded h-2 bg-gray-100", { ["bg-red-500"]: !enabled, ["bg-green-500"]: enabled })}
        ></div>
    </Card>
);

const Info = ({ title, text }: { title: string; text: string }) => (
    <Card value={text} title={title}>
        {/* <div
            className={classNames("relative w-1/2 rounded h-2 bg-gray-100", { ["bg-red-500"]: !enabled, ["bg-green-500"]: enabled })}
        ></div> */}
    </Card>
);

export const DashboardCard = {
    Range,
    Discrete,
    Info,
};