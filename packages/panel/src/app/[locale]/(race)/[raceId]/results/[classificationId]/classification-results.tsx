"use client";

import { mdiAlertCircleOutline, mdiAlertOutline, mdiCloseOctagonOutline, mdiRestore } from "@mdi/js";
import Icon from "@mdi/react";
import { formatTimeWithMilliSecUTC } from "@set/utils/dist/datetime";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { Classifications } from "src/components/classifications";
import { PageHeader } from "src/components/page-headers";
import { SidePage } from "src/components/pages";
import { ApplyTimePenalty } from "src/components/panel/result/apply-time-penalty";
import { DisqualifyPlayer } from "src/components/panel/result/disqualify-player";
import { ManageTimePenalties } from "src/components/panel/result/manage-time-penalties";
import { NewPoorActionsItem, PoorActions } from "src/components/poor-actions";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { PoorConfirmation, PoorModal } from "src/components/poor-modal";
import { SplitTimeResult } from "src/components/split-time-result";
import { Tooltip, TooltipContent, TooltipTrigger } from "src/components/tooltip";
import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
import { useCurrentRaceId } from "../../../../../../hooks";
import { trpc } from "../../../../../../trpc-core";

type Result = AppRouterOutputs["result"]["directorsResults"][0];
type Classification = AppRouterOutputs["classification"]["classification"];
type ClassificationListItem = AppRouterOutputs["classification"]["classifications"][0];
type RevertedSplitTime = AppRouterInputs["splitTime"]["revert"];

export const ClassificationResults = ({
    classification,
    raceId,
    initialClassifications,
}: {
    raceId: number;
    classification: Classification;
    initialClassifications: ClassificationListItem[];
}) => {
    const { data: classifications } = trpc.classification.classifications.useQuery(
        { raceId: Number(raceId) },
        { initialData: initialClassifications },
    );

    return (
        <SidePage
            side={
                <Classifications
                    navigationPath="results"
                    raceId={String(raceId)}
                    classificationId={String(classification.id)}
                    classifications={classifications}
                />
            }
            content={<Results classificationId={classification.id} />}></SidePage>
    );
};

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

const Results = ({ classificationId }: { classificationId: number }) => {
    const raceId = useCurrentRaceId();

    const { data: results, refetch: refetchResults } = trpc.result.directorsResults.useQuery(
        { raceId: raceId, classificationId: classificationId },
        {
            enabled: classificationId !== undefined,
        },
    );

    const { data: race } = trpc.race.race.useQuery({ raceId: raceId });

    const revertSplitTimeMutation = trpc.splitTime.revert.useMutation();

    const { data: splitsInOrder } = trpc.split.splitsInOrder.useQuery(
        { raceId: raceId, classificationId: classificationId },
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

    const revertManualSplitTime = async (editedSplitTime: RevertedSplitTime) => {
        await revertSplitTimeMutation.mutateAsync(editedSplitTime);
        await refetchResults();
    };

    const cols: PoorDataTableColumn<Result>[] = [
        {
            field: "hasError",
            headerName: t("pages.results.grid.columns.hasError"),
            sortable: false,
            allowShrink: true,
            cellRenderer: (data: Result) =>
                data.hasError ? (
                    <Tooltip>
                        <TooltipTrigger>
                            <Icon size={0.8} path={mdiAlertCircleOutline} className="rounded-full bg-red-100 text-red-500"></Icon>
                        </TooltipTrigger>
                        <TooltipContent>{t("pages.splitTimes.grid.columns.status.error")}</TooltipContent>
                    </Tooltip>
                ) : data.hasWarning ? (
                    <Tooltip>
                        <TooltipTrigger>
                            <Icon size={0.8} path={mdiAlertCircleOutline} className="rounded-full bg-orange-100 text-orange-500"></Icon>
                        </TooltipTrigger>
                        <TooltipContent>{t("pages.splitTimes.grid.columns.status.warning")}</TooltipContent>
                    </Tooltip>
                ) : null,
        },
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
            field: split.id.toString(),
            headerName: split.name,
            cellRenderer: (data: Result) => (
                <SplitTimeResult
                    refetch={() => refetchResults()}
                    raceId={raceId}
                    raceDate={race?.date ?? new Date()}
                    openResetDialog={revertManualSplitTime}
                    bibNumber={data.bibNumber}
                    splitTime={data.times[split.id]}
                    isLoading={revertSplitTimeMutation.isPending}
                    splitId={split.id}
                    classificationId={data.classificationId}
                />
            ),
        })),
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
            field: "actions",
            headerName: t("pages.results.grid.columns.actions"),
            allowShrink: true,
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
                            destructive
                            onAccept={() => revertDisqualification(data)}
                            title={t("pages.results.revertDisqualification.confirmation.title")}
                            message={t("pages.results.revertDisqualification.confirmation.text", {
                                name: data.name,
                                lastName: data.lastName,
                            })}
                            isLoading={revertDisqualificationMutation.isPending}>
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
                {results && (
                    <div className="flex-grow">
                        <PoorDataTable
                            data={results}
                            columns={cols}
                            searchPlaceholder={t("pages.results.grid.search.placeholder")}
                            getRowId={item => item.bibNumber}
                            gridName={`results.${classificationId}`}
                            searchFields={["name", "lastName", "team", "bibNumber"]}
                        />
                    </div>
                )}
            </div>
        </>
    );
};
