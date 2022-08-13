import { formatTime, sortDesc } from "@set/shared/dist";
import { HistoricAction } from "@set/timer/dist/model";
import { reset } from "@set/timer/dist/slices/time-stamps";
import { useTimerSelector } from "../../hooks";

const ActionDisplay = ({ historicAction }: { historicAction: HistoricAction }) => {
    if (reset.match(historicAction.action)) {
        return null;
    }

    return (
        <div className="py-2">
            <div>{historicAction.action.type}</div>
            <div className="flex text-xs text-gray-500">
                <div>{formatTime(new Date(historicAction.issuedAt))}</div>
                <div className="ml-2">{historicAction.issuer}</div>
            </div>
        </div>
    );
};

export const History = () => {
    const actionsHistory = useTimerSelector(x => x.actionsHistory || []);

    return (
        <div className="px-4">
            {sortDesc(actionsHistory, a => a.issuedAt).map((a, i) => (
                <ActionDisplay key={i} historicAction={a} />
            ))}
        </div>
    );
};

export default History;