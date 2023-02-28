import { formatTime } from "@set/utils/dist/datetime";
import { sortDesc } from "@set/utils/dist/array";
import { HistoricAction } from "@set/timer/dist/model";
import { useTimerSelector } from "../../../hooks";

const ActionDisplay = ({ historicAction }: { historicAction: HistoricAction }) => {
    return (
        <div className="my-1 flex py-2 px-3 items-center justify-between relative rounded-xl shadow bg-white">
            <div className="flex flex-col text-sm">
                <div>{formatTime(new Date(historicAction.issuedAt))}</div>
                <div>{historicAction.issuer}</div>
            </div>
            <div>{historicAction.action.type.split('/')[1]}</div>
        </div>
    );
};

export const History = () => {
    const actionsHistory = useTimerSelector((x) => x.actionsHistory || []);

    return (
        <div className="px-2 py-1">
            {sortDesc(actionsHistory, (a) => a.issuedAt).map((a, i) => (
                <ActionDisplay key={i} historicAction={a} />
            ))}
        </div>
    );
};

export default History;
