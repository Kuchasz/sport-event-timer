"use client";
import { formatTimeWithMilliSec, formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";
import type { AppRouterOutputs } from "src/trpc";
import { trpc } from "../../../../../trpc-core";

import { mdiAlertOutline, mdiCloseOctagonOutline, mdiRestore } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { PoorConfirmation, PoorModal } from "src/components/poor-modal";
import { PageHeader } from "src/components/page-headers";
import { ApplyTimePenalty } from "src/components/panel/result/apply-time-penalty";
import { DisqualifyPlayer } from "src/components/panel/result/disqualify-player";
import { ManageTimePenalties } from "src/components/panel/result/manage-time-penalties";
import { PoorActions, NewPoorActionsItem } from "src/components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useCurrentRaceId } from "../../../../../hooks";
import { useState } from "react";
import { PoorSelect } from "src/components/poor-select";

type Result = AppRouterOutputs["result"]["results"][0];

const PlayerTimePenalty = ({ raceId, result, refetch }: { raceId: number; result: Result; refetch: () => Promise<void> }) => {
    const t = useTranslations();

    return result.totalTimePenalty ? (
        <PoorModal
            onResolve={refetch}
            title={t("pages.results.manageTimePenalties.confirmation.title")}
            description={t("pages.results.manageTimePenalties.confirmation.text", {
                name: result.name,
                lastName: result.lastName,
            })}
            component={ManageTimePenalties}
            componentProps={{
                initialPenalties: result.timePenalties,
                bibNumber: result.bibNumber,
                raceId: raceId,
                playerId: result.id,
                name: result.name,
                lastName: result.lastName,
                onReject: () => {},
            }}>
            <span
                className={classNames("flex h-full cursor-pointer items-center hover:text-black", {
                    ["font-semibold text-orange-600"]: result.totalTimePenalty !== null,
                })}>
                <Icon size={0.8} path={mdiAlertOutline} />
                <span className="ml-2">{formatTimeWithMilliSecUTC(result.totalTimePenalty)}</span>
            </span>
        </PoorModal>
    ) : null;
};

export const Results = () => {
    const raceId = useCurrentRaceId();
    const { data: classifications } = trpc.classification.classifications.useQuery({ raceId: raceId }, { initialData: [] });

    const [classificationId, setClassificationId] = useState<number>();

    const { data: results, refetch: refetchResults } = trpc.result.results.useQuery(
        { raceId: raceId, classificationId: classificationId! },
        {
            enabled: classificationId !== undefined,
        },
    );

    const { data: splitsInOrder } = trpc.split.splitsInOrder.useQuery(
        { raceId: raceId, classificationId: classificationId! },
        {
            enabled: classificationId !== undefined,
            initialData: [],
        },
    );

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
        ...splitsInOrder.map(split => ({
            field: "id" as any,
            headerName: split.name,
            sortable: true,
            cellRenderer: (data: Result) => <span>{formatTimeWithMilliSec(data.times[split.id])}</span>,
        })),
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
                    raceId={raceId}
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
                <PoorActions>
                    <PoorModal
                        onResolve={() => refetchResults()}
                        title={t("pages.results.applyTimePenalty.confirmation.title")}
                        description={t("pages.results.applyTimePenalty.confirmation.text", {
                            name: data.name,
                            lastName: data.lastName,
                        })}
                        component={ApplyTimePenalty}
                        componentProps={{
                            bibNumber: data.bibNumber,
                            raceId,
                            onReject: () => {},
                        }}>
                        <NewPoorActionsItem
                            name={t("pages.results.applyTimePenalty.title")}
                            description={t("pages.results.applyTimePenalty.description")}
                            iconPath={mdiAlertOutline}></NewPoorActionsItem>
                    </PoorModal>
                    {disqualifications[data.bibNumber] ? (
                        <PoorConfirmation
                            onAccept={() => revertDisqualification(data)}
                            title={t("pages.results.revertDisqualification.confirmation.title")}
                            message={t("pages.results.revertDisqualification.confirmation.text", {
                                name: data.name,
                                lastName: data.lastName,
                            })}
                            isLoading={revertDisqualificationMutation.isLoading}>
                            <NewPoorActionsItem
                                name={t("pages.results.revertDisqualification.title")}
                                description={t("pages.results.revertDisqualification.description")}
                                iconPath={mdiRestore}></NewPoorActionsItem>
                        </PoorConfirmation>
                    ) : (
                        <PoorModal
                            onResolve={() => disqualify(data)}
                            title={t("pages.results.disqualify.confirmation.title")}
                            description={t("pages.results.disqualify.confirmation.text", {
                                name: data.name,
                                lastName: data.lastName,
                            })}
                            component={DisqualifyPlayer}
                            componentProps={{
                                bibNumber: data.bibNumber,
                                raceId,
                                onReject: () => {},
                            }}>
                            <NewPoorActionsItem
                                name={t("pages.results.disqualify.title")}
                                description={t("pages.results.disqualify.description")}
                                iconPath={mdiCloseOctagonOutline}></NewPoorActionsItem>
                        </PoorModal>
                    )}
                </PoorActions>
            ),
        },
    ];

    const disqualify = (_result: Result) => {
        void refetchResults();
        void refetchDisqualifications();
    };

    const revertDisqualification = async (result: Result) => {
        await revertDisqualificationMutation.mutateAsync({ id: disqualifications[result.bibNumber] });
        void refetchResults();
        void refetchDisqualifications();
    };

    return (
        <>
            <Head>
                <title>{t("pages.results.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.results.header.title")} description={t("pages.results.header.description")} />
                <div className="my-2">
                    <PoorSelect
                        initialValue={classificationId}
                        items={classifications}
                        placeholder={t("pages.players.form.classification.placeholder")}
                        nameKey="name"
                        valueKey="id"
                        onChange={e => setClassificationId(e.target.value)}></PoorSelect>
                </div>
                {results && (
                    <div className="flex-grow overflow-hidden">
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
