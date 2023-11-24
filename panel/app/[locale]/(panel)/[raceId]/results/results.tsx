"use client";
import { formatTimeWithMilliSec, formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "../../../../../trpc-core";

import { mdiTrashCan } from "@mdi/js";
import { Confirmation } from "components/confirmation";
import { NiceModal } from "components/modal";
import { PageHeader } from "components/page-header";
import { PoorActions } from "components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { Demodal } from "demodal";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useCurrentRaceId } from "../../../../../hooks";

type Result = AppRouterOutputs["result"]["results"][0];

export const Results = () => {
    const raceId = useCurrentRaceId();
    const { data: results, refetch } = trpc.result.results.useQuery({ raceId: raceId });
    const t = useTranslations();

    const cols: PoorDataTableColumn<Result>[] = [
        {
            field: "bibNumber",
            sortable: true,
            headerName: t("pages.results.grid.columns.bibNumber"),
        },
        {
            field: "name",
            sortable: true,
            headerName: t("pages.results.grid.columns.playerName"),
        },
        {
            field: "lastName",
            sortable: true,
            headerName: t("pages.results.grid.columns.playerLastName"),
        },
        {
            field: "start",
            headerName: t("pages.results.grid.columns.start"),
            sortable: true,
            cellRenderer: (data: Result) => <span>{formatTimeWithMilliSec(data.start)}</span>,
        },
        {
            field: "finish",
            headerName: t("pages.results.grid.columns.finish"),
            sortable: true,
            cellRenderer: (data: Result) => <span>{formatTimeWithMilliSec(data.finish)}</span>,
        },
        {
            field: "result",
            headerName: t("pages.results.grid.columns.result"),
            sortable: true,
            cellRenderer: (data: Result) => (
                <span className="flex flex-col items-end font-mono uppercase">
                    {data.invalidState ? data.invalidState : formatTimeWithMilliSecUTC(data.result)}
                </span>
            ),
        },
        {
            field: "bibNumber",
            headerName: t("pages.results.grid.columns.actions"),
            cellRenderer: (data: Result) => <PoorActions item={data} actions={[revertTimePenalty, revertDisqualification]} />,
        },
    ];

    const revertDisqualification = {
        name: t("pages.playerRegistrations.delete.title"),
        description: t("pages.playerRegistrations.delete.description"),
        iconPath: mdiTrashCan,
        execute: async (_result: Result) => {
            const confirmed = await Demodal.open<boolean>(NiceModal, {
                title: t("pages.playerRegistrations.delete.confirmation.title"),
                component: Confirmation,
                props: {
                    message: t("pages.playerRegistrations.delete.confirmation.text", {
                        // name: playerRegistration.name,
                        // lastName: playerRegistration.lastName,
                    }),
                },
            });

            if (confirmed) {
                // await deletePlayerMutation.mutateAsync({ playerId: playerRegistration.id });
                void refetch();
            }
        },
    };

    const revertTimePenalty = {
        name: t("pages.playerRegistrations.delete.title"),
        description: t("pages.playerRegistrations.delete.description"),
        iconPath: mdiTrashCan,
        execute: async (_result: Result) => {
            const confirmed = await Demodal.open<boolean>(NiceModal, {
                title: t("pages.playerRegistrations.delete.confirmation.title"),
                component: Confirmation,
                props: {
                    message: t("pages.playerRegistrations.delete.confirmation.text", {
                        // name: playerRegistration.name,
                        // lastName: playerRegistration.lastName,
                    }),
                },
            });

            if (confirmed) {
                // await deletePlayerMutation.mutateAsync({ playerId: playerRegistration.id });
                void refetch();
            }
        },
    };

    return (
        <>
            <Head>
                <title>{t("pages.results.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.results.header.title")} description={t("pages.results.header.description")} />

                {results && (
                    <div className="m-4 flex-grow overflow-hidden rounded-xl p-8 shadow-md">
                        <PoorDataTable
                            data={results}
                            columns={cols}
                            searchPlaceholder={t("pages.results.grid.search.placeholder")}
                            getRowId={item => item.bibNumber!}
                            gridName="results"
                            searchFields={["name", "lastName", "team", "bibNumber"]}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
