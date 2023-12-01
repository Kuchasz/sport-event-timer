import { mdiTrashCan } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "components/button";
import { ConfirmationModal } from "components/modal";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { useTranslations } from "next-intl";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "trpc-core";

type TimePenalty = AppRouterOutputs["result"]["results"][0]["timePenalties"][0];

type ManageTimePenaltiesProps = {
    onResolve: (status: boolean) => void;
    onReject: () => void;
    playerId: number;
    initialPenalties: TimePenalty[];
    bibNumber: string;
    raceId: number;
    name: string;
    lastName: string;
};

const TimePenaltyActions = ({
    timePenalty,
    name,
    lastName,
    refetch,
}: {
    timePenalty: TimePenalty;
    name: string;
    lastName: string;
    refetch: () => void;
}) => {
    const revertTimePenaltyMutation = trpc.timePenalty.revert.useMutation();
    const t = useTranslations();

    const revertTimePenalty = async () => {
        await revertTimePenaltyMutation.mutateAsync({ id: timePenalty.id });
        refetch();
    };

    return (
        <ConfirmationModal
            message={t("pages.results.manageTimePenalties.revertTimePenalty.confirmation.text", {
                name: name,
                lastName: lastName,
            })}
            title={t("pages.results.manageTimePenalties.revertTimePenalty.confirmation.title")}
            onAccept={() => revertTimePenalty()}>
            <span className="flex cursor-pointer items-center hover:text-red-600">
                <Icon size={0.8} path={mdiTrashCan} />
                {t("pages.bibNumbers.delete.button")}
            </span>
        </ConfirmationModal>
    );
};

export const ManageTimePenalties = ({ onReject, initialPenalties, bibNumber, raceId, name, lastName }: ManageTimePenaltiesProps) => {
    const t = useTranslations();
    const { data: penalties, refetch } = trpc.timePenalty.playerPenalties.useQuery(
        { bibNumber, raceId },
        { initialData: initialPenalties },
    );

    const cols: PoorDataTableColumn<TimePenalty>[] = [
        { field: "reason", headerName: t("pages.results.manageTimePenalties.grid.columns.reason"), sortable: false },
        { field: "time", headerName: t("pages.results.manageTimePenalties.grid.columns.time"), sortable: false },
        {
            field: "time",
            headerName: t("pages.results.manageTimePenalties.grid.columns.actions"),
            sortable: false,
            cellRenderer: data => <TimePenaltyActions name={name} lastName={lastName} refetch={refetch} timePenalty={data} />,
        },
    ];

    return (
        <div className="flex flex-col">
            <PoorDataTable<TimePenalty>
                hideColumnsChooser
                hidePaging
                gridName="time-penalties"
                columns={cols}
                data={penalties ?? []}
                getRowId={p => p.id}></PoorDataTable>
            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    {t("shared.close")}
                </Button>
            </div>
        </div>
    );
};
