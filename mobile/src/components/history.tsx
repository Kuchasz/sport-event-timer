import { useTimerSelector } from "../hooks";

export const History = () => {
    const actionsHistory = useTimerSelector((x) => x.actionsHistory);

    return (
        <div>
            <h1 className="text-3xl">Actions history</h1>
            {actionsHistory.map((a, i) => (
                <div key={i}>{a.type}</div>
            ))}
        </div>
    );
};
