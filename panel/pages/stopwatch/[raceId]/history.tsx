import { formatTime, sortDesc } from "@set/shared/dist";
import { HistoricAction } from "@set/timer/dist/model";
import { useTimerSelector } from "../../../hooks";
// import { reset } from "@set/timer/dist/slices/time-stamps";

const ActionDisplay = ({ historicAction }: { historicAction: HistoricAction }) => {
    // if (reset.match(historicAction.action)) {
    //     return null;
    // }

    return (
        <div className="my-1 flex py-2 px-3 items-center justify-between relative rounded-xl shadow bg-white">
            <div className="flex flex-col text-sm text-gray-500">
                <div>{formatTime(new Date(historicAction.issuedAt))}</div>
                <div >{historicAction.issuer}</div>
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
