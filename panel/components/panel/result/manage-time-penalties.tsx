import { mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { useTranslations } from "next-intl";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "trpc-core";

type TimePenalty = AppRouterOutputs["result"]["results"][0]["timePenalties"][0];

type ManageTimePenaltiesProps = {
    onResolve: (penaltyId: number) => void;
    onReject: () => void;
    playerId: number;
    penalties: TimePenalty[];
};

export const ManageTimePenalties = ({ onResolve, onReject, penalties }: ManageTimePenaltiesProps) => {
    const t = useTranslations();
    const revertTimePenaltyMutation = trpc.timePenalty.revert.useMutation();

    const revertTimePenalty = async (penaltyId: number) => {
        await revertTimePenaltyMutation.mutateAsync({ id: penaltyId });
        onResolve(penaltyId);
    };

    const cols: PoorDataTableColumn<TimePenalty>[] = [
        { field: "reason", headerName: t("pages.results.manageTimePenalties.grid.columns.reason"), sortable: false },
        { field: "time", headerName: t("pages.results.manageTimePenalties.grid.columns.time"), sortable: false },
        {
            field: "time",
            headerName: t("pages.results.manageTimePenalties.grid.columns.actions"),
            sortable: false,
            cellRenderer: data => (
                <span className="flex cursor-pointer items-center hover:text-red-600" onClick={() => revertTimePenalty(data.id)}>
                    <Icon size={0.8} path={mdiTrashCan} />
                    {t("pages.bibNumbers.delete.button")}
                </span>
            ),
        },
    ];

    return (
        <div className="flex flex-col">
            <PoorDataTable<TimePenalty>
                hideColumnsChooser
                hidePaging
                gridName="time-penalties"
                columns={cols}
                data={penalties}
                getRowId={p => p.id}
            ></PoorDataTable>
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    {t("shared.cancel")}
                </Button>
                <Button loading={false} type="submit">
                    {t("shared.save")}
                </Button>
            </div>
        </div>
    );
};
