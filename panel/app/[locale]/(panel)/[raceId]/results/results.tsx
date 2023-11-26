"use client";
import { formatTimeWithMilliSec, formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";
import type { AppRouterOutputs } from "trpc";
import { trpc } from "../../../../../trpc-core";

import { mdiAlertOutline, mdiCloseOctagonOutline, mdiRestore } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { Confirmation } from "components/confirmation";
import { NiceConfirmation, NiceModal } from "components/modal";
import { PageHeader } from "components/page-header";
import { ApplyTimePenalty } from "components/panel/result/apply-time-penalty";
import { DisqualifyPlayer } from "components/panel/result/disqualify-player";
import { ManageTimePenalties } from "components/panel/result/manage-time-penalties";
import { PoorActions } from "components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "components/poor-data-table";
import { Demodal } from "demodal";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useCurrentRaceId } from "../../../../../hooks";

type Result = AppRouterOutputs["result"]["results"][0];

const PlayerTimePenalty = ({ result, refetch }: { result: Result; refetch: () => Promise<void> }) => {
    // const setPaymentStatusMutation = trpc.playerRegistration.setPaymentStatus.useMutation();
    const t = useTranslations();

    const managePlayerPenalties = async () => {
        const fooo = await Demodal.open(NiceModal, {
            title: t("pages.results.manageTimePenalties.confirmation.title"),
            description: t("pages.results.manageTimePenalties.confirmation.text", {
                name: result.name,
                lastName: result.lastName,
            }),
            component: ManageTimePenalties,
            props: {
                penalties: result.timePenalties,
                playerId: result.id,
                name: result.name,
                lastName: result.lastName,
            },
        });

        if (fooo) {
            console.log;
            void refetch();
        }
    };

    // const locale = useLocale();

    // const togglePlayerPayment = async () => {
    //     const confirmed = await Demodal.open<boolean>(NiceModal, {
    //         title: t("pages.playerRegistrations.togglePlayerPayment.confirmation.title"),
    //         component: Confirmation,
    //         props: {
    //             message: t("pages.playerRegistrations.togglePlayerPayment.confirmation.text", {
    //                 name: playerRegistration.name,
    //                 lastName: playerRegistration.lastName,
    //                 hasPaid: playerRegistration.hasPaid
    //                     ? t("pages.playerRegistrations.payment.status.notPaid")
    //                     : t("pages.playerRegistrations.payment.status.paid"),
    //             }),
    //         },
    //     });

    //     if (confirmed) {
    //         await setPaymentStatusMutation.mutateAsync({ playerId: playerRegistration.id, hasPaid: !playerRegistration.hasPaid });
    //         await refetch();
    //     }
    // };
    return result.totalTimePenalty ? (
        <span
            className={classNames("flex h-full cursor-pointer items-center hover:text-black", {
                ["font-semibold text-orange-600"]: result.totalTimePenalty !== null,
            })}
            onClick={managePlayerPenalties}
        >
            <Icon size={0.8} path={mdiAlertOutline} />
            <span className="ml-2">{formatTimeWithMilliSecUTC(result.totalTimePenalty)}</span>
        </span>
    ) : null;
};

export const Results = () => {
    const raceId = useCurrentRaceId();
    const { data: results, refetch: refetchResults } = trpc.result.results.useQuery({ raceId: raceId });

    const { data: disqualifications, refetch: refetchDisqualifications } = trpc.disqualification.disqualifications.useQuery(
        {
            raceId: raceId,
        },
        { initialData: {} },
    );

    const revertDisqualificationMutation = trpc.disqualification.revert.useMutation();
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
            headerName: t("pages.results.grid.columns.totalTimePenalty"),
            sortable: true,
            cellRenderer: (data: Result) => (
                <PlayerTimePenalty
                    result={data}
                    refetch={async () => {
                        await refetchResults();
                    }}
                />
            ),
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
                        // timePenalties[data.bibNumber] ? revertTimePenalty : applyTimePenalty,
                        applyTimePenalty,
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
            const confirmed = await Demodal.open<boolean>(NiceConfirmation, {
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
                id: "manage-penalties",
            });

            if (timePenalty) {
                void refetchResults();
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
