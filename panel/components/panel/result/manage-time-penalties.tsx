import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { useTranslations } from "next-intl";
import type { AppRouterOutputs } from "trpc";

type TimePenalty = AppRouterOutputs["result"]["results"][0]["timePenalties"][0];

type ManageTimePenaltiesProps = {
    onResolve: (penalty: TimePenalty) => void;
    onReject: () => void;
    playerId: number;
    penalties: TimePenalty[];
};

export const ManageTimePenalties = ({ penalties }: ManageTimePenaltiesProps) => {
    const t = useTranslations();
    const cols: PoorDataTableColumn<TimePenalty>[] = [
        { field: "reason", headerName: t("pages.results.manageTimePenalties.grid.columns.reason"), sortable: false },
        { field: "time", headerName: t("pages.results.manageTimePenalties.grid.columns.time"), sortable: false },
    ];

    return (
        <div>
            <PoorDataTable<TimePenalty>
                hideColumnsChooser
                hidePaging
                gridName="time-penalties"
                columns={cols}
                data={penalties}
                getRowId={p => p.key}
            ></PoorDataTable>
            {/* <div>
                {penalties.map(p => (
                    <div key={p.key}>
                        <div>{p.time}</div>
                        <div>{p.reason}</div>
                    </div>
                ))}
            </div> */}
        </div>
    );
};
