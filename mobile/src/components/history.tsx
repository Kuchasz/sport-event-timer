import { useTimerSelector } from "../hooks";

export const History = () => {
    const actionsHistory = useTimerSelector((x) => x.actionsHistory || []);

    return (
        <div>
            <h1 className="text-3xl">Actions history</h1>
            {actionsHistory.map((a, i) => (
                <div key={i} className="p-2">
                    <div>{a.type}</div>
                    <div className="text-xs text-gray-500">{a.issuer}</div>
                </div>
            ))}
        </div>
    );
};
