import type { AppRouterOutputs } from "trpc";

type TimePenalty = AppRouterOutputs["result"]["results"][0]["timePenalties"][0];

type ManageTimePenaltiesProps = {
    onResolve: (penalty: TimePenalty) => void;
    onReject: () => void;
    raceId: number;
    bibNumber: string;
    penalties: TimePenalty[];
};

export const ManageTimePenalties = ({ penalties }: ManageTimePenaltiesProps) => {
    return (
        <div>
            <div>
                {penalties.map(p => (
                    <div key={p.key}>
                        <div>{p.time}</div>
                        <div>{p.reason}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
