import { mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "src/components/button";
import { PoorConfirmation } from "src/components/poor-modal";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { AppRouterOutputs } from "src/trpc";
import { trpc } from "src/trpc-core";
import { formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";

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
        <PoorConfirmation
            destructive
            message={t("pages.results.manageTimePenalties.revertTimePenalty.confirmation.text", {
                name: name,
                lastName: lastName,
            })}
            title={t("pages.results.manageTimePenalties.revertTimePenalty.confirmation.title")}
            onAccept={() => revertTimePenalty()}
            isLoading={revertTimePenaltyMutation.isLoading}>
            <span className="flex cursor-pointer items-center hover:text-red-600">
                <Icon size={0.8} path={mdiTrashCanOutline} />
                {t("pages.results.manageTimePenalties.revertTimePenalty.button")}
            </span>
        </PoorConfirmation>
    );
};

export const ManageTimePenalties = ({ onResolve, initialPenalties, bibNumber, raceId, name, lastName }: ManageTimePenaltiesProps) => {
    const t = useTranslations();
    const { data: penalties, refetch } = trpc.timePenalty.playerPenalties.useQuery(
        { bibNumber, raceId },
        { initialData: initialPenalties },
    );

    const [penaltiesChanged, setPenaltiesChanged] = useState<boolean>(false);

    const cols: PoorDataTableColumn<TimePenalty>[] = [
        { field: "reason", headerName: t("pages.results.manageTimePenalties.grid.columns.reason"), sortable: false },
        {
            field: "time",
            headerName: t("pages.results.manageTimePenalties.grid.columns.time"),
            sortable: false,
            cellRenderer: data => <span>{formatTimeWithMilliSecUTC(data.time)}</span>,
        },
        {
            field: "actions",
            allowShrink: true,
            headerName: t("pages.results.manageTimePenalties.grid.columns.actions"),
            cellRenderer: data => (
                <TimePenaltyActions
                    name={name}
                    lastName={lastName}
                    refetch={() => {
                        setPenaltiesChanged(true);
                        void refetch();
                    }}
                    timePenalty={data}
                />
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
                data={penalties ?? []}
                getRowId={p => p.id}></PoorDataTable>
            <div className="mt-4 flex justify-between">
                <Button onClick={() => onResolve(penaltiesChanged)} outline>
                    {t("shared.close")}
                </Button>
            </div>
        </div>
    );
};
