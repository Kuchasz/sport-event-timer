"use client";

import { mdiDrag, mdiFileDocumentArrowRightOutline, mdiPlus, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "src/components/button";
import { PageHeader, SectionHeader } from "src/components/page-headers";
import { TimingPointCreate } from "src/components/panel/timing-point/timing-point-create";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { PoorInput } from "src/components/poor-input";
import { PoorModal } from "src/components/poor-modal";
import { PoorSelect } from "src/components/poor-select";
import { FormCard, Label } from "src/form";
import type { AppRouterOutputs } from "src/trpc";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];
type Split = AppRouterOutputs["split"]["splits"][0];

const DropTarget = ({ onDrop, moveMode }: { onDrop: () => void; moveMode: number }) => (
    <div
        onClick={onDrop}
        className={classNames(
            "text-2xs col-span-5 flex cursor-pointer justify-center overflow-hidden rounded-md bg-gray-100 font-semibold uppercase text-gray-700 transition-all hover:bg-gray-50",
            moveMode ? "h-auto px-2 py-1" : "h-0",
        )}>
        drop element here
    </div>
);

const SplitRow = ({
    s,
    timingPoints,
    onEnableMoveMode,
    onDeleteSplit,
}: {
    s: Split;
    timingPoints: TimingPoint[];
    onEnableMoveMode: (id: number) => void;
    onDeleteSplit: (id: number) => void;
}) => {
    return (
        <>
            <SplitButton onClick={() => onEnableMoveMode(s.id)} icon={mdiDrag} />
            <PoorInput value={s.name} onChange={() => {}}></PoorInput>
            <PoorSelect
                initialValue={s.timingPointId}
                items={timingPoints}
                placeholder="choose timing point"
                nameKey="name"
                valueKey="id"
                onChange={() => {}}></PoorSelect>
            <PoorInput value={s.name} onChange={() => {}}></PoorInput>
            <SplitButton onClick={() => onDeleteSplit(s.id)} icon={mdiTrashCanOutline} />
        </>
    );
};
type SplitsProps = {
    classificationId: number;
    timingPoints: TimingPoint[];
    raceId: number;
    splits: Split[];
    splitsOrder: number[];
};

const SplitButton = ({ onClick, icon }: { onClick: () => void; icon: string }) => {
    return (
        <div className="flex cursor-pointer items-center self-center rounded-full p-2 hover:bg-gray-100" onClick={onClick}>
            <Icon size={0.8} path={icon} />
        </div>
    );
};

const Splits = ({ timingPoints, classificationId, raceId, splits, splitsOrder }: SplitsProps) => {
    const [newSplits, setNewSplits] = useState<Split[]>(splits);
    const [newSplitsOrder, setNewSplitsOrder] = useState<number[]>(splitsOrder);
    const [moveMode, setMoveMode] = useState<number>(0);

    const t = useTranslations();

    const splitsInOrder = newSplitsOrder.map(split => newSplits.find(s => split === s.id)!);

    const addSplit = () => {
        const minId = Math.min(...newSplits.map(tp => tp.id));
        const id = (minId > 0 ? 0 : minId) - 2;
        setNewSplits([
            ...newSplits,
            {
                id,
                name: "Split",
                timingPointId: timingPoints[0].id,
                raceId,
                classificationId,
            },
        ]);
        setNewSplitsOrder([...newSplitsOrder, id]);
    };

    const handleMoveMode = (id: number) => {
        if (moveMode === id) {
            setMoveMode(0);
            return;
        }

        setMoveMode(id);
    };

    const handleDeleteSplit = (id: number) => {
        setNewSplits(newSplits.filter(s => s.id !== id));
        setNewSplitsOrder(newSplitsOrder.filter(s => s !== id));
    };

    const moveSplitToIndex = (dropIndex: number, splitId: number) => {
        setMoveMode(0);
        // console.log(`dropIndex: ${dropIndex}, splitId: ${splitId}`);

        const newOrder = newSplitsOrder.filter(s => s !== splitId);
        newOrder.splice(dropIndex, 0, splitId);
        setNewSplitsOrder(newOrder);
    };

    return (
        <FormCard title="lorem ipsum polelum">
            <div className="">
                <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: "min-content 1fr 1fr 1fr min-content" }}>
                    <div></div>
                    <Label>Name</Label>
                    <Label>Timing Point</Label>
                    <Label>Distance</Label>
                    <Label></Label>
                    {splitsInOrder.map((s, index) => (
                        <React.Fragment key={s.id}>
                            <DropTarget onDrop={() => moveSplitToIndex(index, moveMode)} moveMode={moveMode} />
                            <SplitRow
                                s={s}
                                timingPoints={timingPoints}
                                onEnableMoveMode={handleMoveMode}
                                onDeleteSplit={handleDeleteSplit}
                            />
                            {index === splitsInOrder.length - 1 && (
                                <DropTarget onDrop={() => moveSplitToIndex(index + 1, moveMode)} moveMode={moveMode} />
                            )}
                        </React.Fragment>
                    ))}
                    <div className="col-span-4 flex items-center justify-end"></div>
                    <SplitButton icon={mdiPlus} onClick={addSplit} />
                </div>
                <div className="mt-4 flex">
                    <Button outline>{t("shared.cancel")}</Button>
                    <Button className="ml-2" type="submit">
                        {t("shared.save")}
                    </Button>
                </div>
            </div>
        </FormCard>
    );
};

export const TimingPoints = () => {
    const raceId = useCurrentRaceId();
    const { data: timingPoints, refetch: refetchTimingPoints } = trpc.timingPoint.timingPoints.useQuery(
        { raceId: raceId },
        { initialData: [] },
    );
    const { data: classifications } = trpc.classification.classifications.useQuery({ raceId: raceId }, { initialData: [] });

    const [classificationId, setClassificationId] = useState<number>();
    const t = useTranslations();
    const router = useRouter();

    const { data: splitsOrder, refetch: refetchOrder } = trpc.split.splitsOrder.useQuery(
        { raceId: raceId, classificationId: classificationId! },
        {
            enabled: !!classificationId,
            initialData: [],
        },
    );

    const { data: splits, refetch: refetchSplits } = trpc.split.splits.useQuery(
        { raceId: raceId, classificationId: classificationId! },
        {
            enabled: !!classificationId,
            initialData: [],
        },
    );

    // const updateOrderMutation = trpc.split.updateOrder.useMutation();

    const cols: PoorDataTableColumn<TimingPoint>[] = [
        { field: "name", headerName: t("pages.timingPoints.sections.grid.columns.name"), sortable: true },
        {
            field: "abbrev",
            headerName: t("pages.timingPoints.sections.grid.columns.shortName"),
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
                <div className="py-8">
                    <SectionHeader
                        title={t("pages.timingPoints.sections.order.header.title")}
                        description={t("pages.timingPoints.sections.order.header.description")}
                    />
                    <div className="my-2">
                        <PoorSelect
                            initialValue={classificationId}
                            items={classifications}
                            placeholder={t("pages.players.form.classification.placeholder")}
                            nameKey="name"
                            valueKey="id"
                            onChange={e => setClassificationId(e.target.value)}></PoorSelect>
                    </div>
                    {splitsOrder.length > 0 ? (
                        <Splits
                            classificationId={classificationId!}
                            timingPoints={timingPoints}
                            raceId={raceId}
                            splits={splits}
                            splitsOrder={splitsOrder}
                        />
                    ) : null}
                </div>
            </div>
        </>
    );
};
