import classNames from "classnames";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

const Card = ({ title, value, children }: { title: string; value: string; children: ReactNode }) => (
    <div className="m-3 flex h-32 w-48 flex-col items-center self-start overflow-clip rounded-md border border-gray-100 p-4 shadow-sm">
        <div className="self-start text-xs font-medium uppercase text-gray-500">{title}</div>
        <div className="my-2 shrink self-start text-lg font-medium uppercase">{value}</div>
        <div className="flex h-full w-full grow flex-col items-center justify-center">{children}</div>
    </div>
);

const Range = ({ title, min, max }: { title: string; min: number; max?: number | null }) => (
    <Card value={max ? `${min} / ${max}` : min.toString()} title={title}>
        <div className="relative h-2 w-full rounded bg-gray-100">
            {max && (
                <div
                    style={{ width: `${Math.min((min / max) * 100, 100)}%` }}
                    className={classNames(`absolute h-2 rounded`, {
                        ["bg-red-500"]: min > max,
                        ["bg-orange-500"]: min === max,
                        ["bg-green-500"]: min < max,
                    })}
                ></div>
            )}
        </div>
    </Card>
);

const Discrete = ({ title, enabled }: { title: string; enabled: boolean }) => {
    const t = useTranslations("shared.status");
    return (
        <Card value={`${enabled ? t("enabled") : t("disabled")}`} title={title}>
            <div
                className={classNames("relative h-2 w-1/2 rounded bg-gray-100", { ["bg-red-500"]: !enabled, ["bg-green-500"]: enabled })}
            ></div>
        </Card>
    );
};

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
