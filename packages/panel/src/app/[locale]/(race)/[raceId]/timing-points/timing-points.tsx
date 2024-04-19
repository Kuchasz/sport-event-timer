"use client";

import { mdiFileDocumentArrowRightOutline, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Button } from "src/components/button";
import { PageHeader, SectionHeader } from "src/components/page-headers";
import { TimingPointCreate } from "src/components/panel/timing-point/timing-point-create";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { PoorModal } from "src/components/poor-modal";
import type { AppRouterOutputs } from "src/trpc";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];

export const TimingPoints = () => {
    const raceId = useCurrentRaceId();
    const { data: timingPoints, refetch: refetchTimingPoints } = trpc.timingPoint.timingPoints.useQuery(
        { raceId: raceId },
        { initialData: [] },
    );

    const t = useTranslations();
    const router = useRouter();

    const cols: PoorDataTableColumn<TimingPoint>[] = [
        { field: "name", headerName: t("pages.timingPoints.sections.grid.columns.name"), sortable: true },
        {
            field: "abbrev",
            headerName: t("pages.timingPoints.sections.grid.columns.abbrev"),
        },
        {
            field: "type",
            headerName: t("pages.timingPoints.sections.grid.columns.type"),
        },
        {
            field: "splits",
            headerName: t("pages.timingPoints.sections.grid.columns.splits"),
        },
        {
            field: "numberOfAccessUrls",
            headerName: t("pages.timingPoints.sections.grid.columns.numberOfAccessUrls"),
        },
        {
            field: "id",
            headerName: t("pages.timingPoints.sections.grid.columns.actions"),
            sortable: false,
            cellRenderer: d => (
                <Button onClick={() => router.push(`/${raceId}/timing-points/${d.id}`)} small outline>
                    <Icon size={0.8} path={mdiFileDocumentArrowRightOutline} />
                    <span className="ml-2">{t("shared.details")}</span>
                </Button>
            ),
        },
    ];

    // const splitsInOrder = mapWithCount(
    //     sortedTimingPoints,
    //     s => s.id,
    //     (tp, split) => ({ ...tp, split }),
    // );

    // const onTimingPointsOrderChange = async (_timingPoints: Split[]) => {
    //     await updateOrderMutation.mutateAsync({ raceId, order: timingPoints.map(t => t.id) });
    //     onTimingPointCreated();
    // };

    const onTimingPointCreated = () => {
        void refetchTimingPoints();
        // void refetchOrder();
    };

    return (
        <>
            <Head>
                <title>{t("pages.timingPoints.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.timingPoints.header.title")} description={t("pages.timingPoints.header.description")} />
                <div className="mt-8">
                    <SectionHeader
                        title={t("pages.timingPoints.sections.grid.header.title")}
                        description={t("pages.timingPoints.sections.grid.header.description")}
                    />
                    <div className="p-2"></div>
                    <PoorModal
                        onResolve={onTimingPointCreated}
                        title={t("pages.timingPoints.create.title")}
                        component={TimingPointCreate}
                        componentProps={{ raceId: raceId, index: 0, onReject: () => {} }}>
                        <Button outline>
                            <Icon size={0.8} path={mdiPlus} />
                            <span className="ml-2">{t("pages.timingPoints.create.button")}</span>
                        </Button>
                    </PoorModal>
                    <div className="p-2"></div>
                    <PoorDataTable columns={cols} hideColumnsChooser getRowId={d => d.id} gridName="timing-points" data={timingPoints} />
                </div>
            </div>
        </>
    );
};
