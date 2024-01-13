"use client";

import { formatTime } from "@set/utils/dist/datetime";
import { sortDesc } from "@set/utils/dist/array";
import type { HistoricAction } from "@set/timer/dist/model";
import { useTimerSelector } from "../../../../../../hooks";
import classNames from "classnames";

const ActionDisplay = ({ historicAction }: { historicAction: HistoricAction }) => {
    return (
        <div className="relative my-1 flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow">
            <div className="flex flex-col text-sm">
                <div>{formatTime(new Date(historicAction.issuedAt))}</div>
                <div>{historicAction.issuer}</div>
            </div>
            <div className="text-xs">
                {historicAction.action.type.split("/").map((n, i, { length }) => (
                    <span
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
