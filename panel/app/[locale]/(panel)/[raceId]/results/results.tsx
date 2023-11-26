"use client";
import { formatTimeWithMilliSec, formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "../../../../../trpc-core";

import { mdiAlertOutline, mdiAlertRemoveOutline, mdiCloseOctagonOutline, mdiRestore } from "@mdi/js";
import { Confirmation } from "components/confirmation";
import { NiceModal } from "components/modal";
import { PageHeader } from "components/page-header";
import { ApplyTimePenalty } from "components/panel/result/apply-time-penalty";
import { DisqualifyPlayer } from "components/panel/result/disqualify-player";
import { PoorActions } from "components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { Demodal } from "demodal";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useCurrentRaceId } from "../../../../../hooks";

type Result = AppRouterOutputs["result"]["results"][0];

export const Results = () => {
    const raceId = useCurrentRaceId();
    const { data: results, refetch: refetchResults } = trpc.result.results.useQuery({ raceId: raceId });
    const { data: timePenalties, refetch: refetchTimePenalties } = trpc.timePenalty.penalties.useQuery(
        { raceId: raceId },
        { initialData: {} },
    );
    const { data: disqualifications, refetch: refetchDisqualifications } = trpc.disqualification.disqualifications.useQuery(
        {
            raceId: raceId,
        },
        { initialData: {} },
    );

    const revertDisqualificationMutation = trpc.disqualification.revert.useMutation();
    const revertTimePenaltyMutation = trpc.timePenalty.revert.useMutation();
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
            field: "totalTimePenalty",
            headerName: "Time Penalty",
            sortable: true,
            cellRenderer: (data: Result) => <span>{formatTimeWithMilliSecUTC(data.totalTimePenalty)}</span>,
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
            cellRenderer: (data: Result) => (
                <PoorActions
                    item={data}
                    actions={[
                        timePenalties[data.bibNumber] ? revertTimePenalty : applyTimePenalty,
                        disqualifications[data.bibNumber] ? revertDisqualification : disqualify,
                    ]}
                />
            ),
        },
    ];

    const disqualify = {
        name: t("pages.results.disqualify.title"),
        description: t("pages.results.disqualify.description"),
        iconPath: mdiCloseOctagonOutline,
        execute: async (result: Result) => {
            const disqualification = await Demodal.open(NiceModal, {
                title: t("pages.results.disqualify.confirmation.title"),
                description: t("pages.results.disqualify.confirmation.text", {
                    name: result.name,
                    lastName: result.lastName,
                }),
                component: DisqualifyPlayer,
                props: {
                    bibNumber: result.bibNumber,
                    raceId,
                },
            });

            if (disqualification) {
                void refetchResults();
                void refetchDisqualifications();
            }
        },
    };

    const revertDisqualification = {
        name: t("pages.results.revertDisqualification.title"),
        description: t("pages.results.revertDisqualification.description"),
        iconPath: mdiRestore,
        execute: async (result: Result) => {
            const confirmed = await Demodal.open<boolean>(NiceModal, {
                title: t("pages.results.revertDisqualification.confirmation.title"),
                component: Confirmation,
                props: {
                    message: t("pages.results.revertDisqualification.confirmation.text", {
                        name: result.name,
                        lastName: result.lastName,
                    }),
                },
            });

            if (confirmed) {
                await revertDisqualificationMutation.mutateAsync({ id: disqualifications[result.bibNumber] });
                void refetchResults();
                void refetchDisqualifications();
            }
        },
    };

    const applyTimePenalty = {
        name: t("pages.results.applyTimePenalty.title"),
        description: t("pages.results.applyTimePenalty.description"),
        iconPath: mdiAlertOutline,
        execute: async (result: Result) => {
            const timePenalty = await Demodal.open(NiceModal, {
                title: t("pages.results.applyTimePenalty.confirmation.title"),
                description: t("pages.results.applyTimePenalty.confirmation.text", {
                    name: result.name,
                    lastName: result.lastName,
                }),
                component: ApplyTimePenalty,
                props: {
                    bibNumber: result.bibNumber,
                    raceId,
                },
            });

            if (timePenalty) {
                void refetchResults();
                void refetchTimePenalties();
            }
        },
    };

    const revertTimePenalty = {
        name: t("pages.results.revertTimePenalty.title"),
        description: t("pages.results.revertTimePenalty.description"),
        iconPath: mdiAlertRemoveOutline,
        execute: async (result: Result) => {
            const confirmed = await Demodal.open<boolean>(NiceModal, {
                title: t("pages.results.revertTimePenalty.confirmation.title"),
                component: Confirmation,
                props: {
                    message: t("pages.results.revertTimePenalty.confirmation.text", {
                        name: result.name,
                        lastName: result.lastName,
                    }),
                },
            });

            if (confirmed) {
                await revertTimePenaltyMutation.mutateAsync({ id: timePenalties[result.bibNumber] });
                void refetchResults();
                void refetchTimePenalties();
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
                            getRowId={item => item.bibNumber}
                            gridName="results"
                            searchFields={["name", "lastName", "team", "bibNumber"]}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
