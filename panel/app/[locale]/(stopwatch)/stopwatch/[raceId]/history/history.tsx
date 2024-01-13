"use client";

import { formatTime } from "@set/utils/dist/datetime";
import { sortDesc } from "@set/utils/dist/array";
import type { HistoricAction } from "@set/timer/dist/model";
import { useTimerSelector } from "../../../../../../hooks";
import classNames from "classnames";
import Avatar from "boring-avatars";

const ActionDisplay = ({ historicAction }: { historicAction: HistoricAction }) => {
    return (
        <div className="relative my-1 flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow">
            <Avatar name={historicAction.issuer} size={32} colors={["#7dd3fc", "#0ea5e9", "#9ca3af"]}></Avatar>
            <div className="ml-3 flex flex-col text-sm font-semibold">
                <div>{historicAction.issuer}</div>
                <div className="text-xs text-gray-400">{formatTime(new Date(historicAction.issuedAt))}</div>
            </div>
            <div className="flex-grow"></div>
            <div className="text-xs">
                {historicAction.action.type.split("/").map((n, i, { length }) => (
                    <span
                        key={`${n}${i}`}
                        className={classNames(
                            "mx-1 rounded-md px-2 py-1",
                            i === length - 1 ? "bg-gray-100 font-semibold uppercase" : null,
                        )}>
                        {n}
                    </span>
                ))}
            </div>
        </div>
    );
};

export const History = () => {
    const actionsHistory = useTimerSelector(x => x.actionsHistory || []);

    return (
        <div className="px-2 py-1">
            {sortDesc(actionsHistory, a => a.issuedAt).map((a, i) => (
                <ActionDisplay key={i} historicAction={a} />
            ))}
        </div>
    );
};
