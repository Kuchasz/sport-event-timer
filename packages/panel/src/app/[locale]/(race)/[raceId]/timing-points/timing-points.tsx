"use client";

import { mdiDrag, mdiFileDocumentArrowRightOutline, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { createRange } from "@set/utils/dist/array";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Button } from "src/components/button";
import { PageHeader, SectionHeader } from "src/components/page-headers";
import { TimingPointCreate } from "src/components/panel/timing-point/timing-point-create";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { PoorModal } from "src/components/poor-modal";
import type { AppRouterOutputs } from "src/trpc";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoints"][0];

type TimingPointWithLap = TimingPoint & { lap: number };

const DropTarget = ({
    index,
    dropTarget,
    dragStarted,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop,
}: {
    index: number;
    dropTarget: number | null;
    dragStarted: boolean;
    onDragEnter: (_event: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (_event: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave: (_event: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (_event: React.DragEvent<HTMLDivElement>) => void;
}) => (
    <div
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={classNames("-z-1 absolute -mt-5 flex h-8 w-80 items-center transition-colors", dropTarget === index ? "" : "", {
            ["z-10"]: dragStarted,
        })}>
        <div
            className={classNames(
                "pointer-events-none mx-4 h-1 w-full bg-red-500 opacity-0 transition-opacity",
                dropTarget === index && "opacity-25",
            )}></div>
    </div>
);

const TimingPointsOrder = ({
    initialTimesInOrder,
    onTimesInOrderChange,
}: {
    initialTimesInOrder: TimingPointWithLap[];
    onTimesInOrderChange: (times: TimingPointWithLap[]) => void;
}) => {
    const dropElements = useRef<(HTMLDivElement | null)[]>([]);
    const elementsHolder = useRef<HTMLDivElement | null>(null);
    const [dragStarted, setDragStarted] = useState(false);
    const [dropTarget, setDropTarget] = useState<number | null>(null);
    const [dragTarget, setDragTarget] = useState<number | null>(null);

    const [timesInOrder, setTimesInOrder] = useState<TimingPointWithLap[]>(initialTimesInOrder);

    const onDragEnter = (idx: number) => (_event: React.DragEvent<HTMLDivElement>) => {
        _event.preventDefault();
        setDropTarget(idx);
    };
    const onDragOver = (_idx: number) => (_event: React.DragEvent<HTMLDivElement>) => {
        _event.dataTransfer.dropEffect = "move";
        _event.preventDefault();
    };
    const onDragLeave = (_event: React.DragEvent<HTMLDivElement>) => {
        setDropTarget(null);
    };

    const onDragStart = (idx: number) => (_event: React.DragEvent<HTMLDivElement>) => {
        setDragStarted(true);
        setDragTarget(idx);

        const crt = _event.currentTarget.cloneNode(true) as HTMLDivElement;
        crt.style.position = "absolute";
        crt.style.top = "-1000px";
        document.body.appendChild(crt);
        _event.dataTransfer.setDragImage(crt, 0, 0);
        setTimeout(() => document.body.removeChild(crt));
    };

    const onDragEnd = (_event: React.DragEvent<HTMLDivElement>) => {
        setDragStarted(false);
        setDragTarget(null);
    };

    const onDrop = (idx: number) => (_event: React.DragEvent<HTMLDivElement>) => {
        const newTimesInOrder = [...timesInOrder];
        const draggedElement = newTimesInOrder.splice(dragTarget!, 1)[0];

        const dropIndex = idx > dragTarget! ? idx - 1 : idx;

        newTimesInOrder.splice(dropIndex, 0, draggedElement);
        setTimesInOrder(newTimesInOrder);
        onTimesInOrderChange(newTimesInOrder);

        setDropTarget(null);
        setDragTarget(null);
    };

    return (
        <div className="relative" ref={elementsHolder}>
            {timesInOrder.map((tio, index) => (
                <div className="relative" key={`${tio.id}.${tio.lap}`}>
                    <DropTarget
                        onDragEnter={onDragEnter(index)}
                        onDragOver={onDragOver(index)}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop(index)}
                        dropTarget={dropTarget}
                        index={index}
                        dragStarted={dragStarted}
                    />
                    <div
                        draggable
                        onDragStart={onDragStart(index)}
                        onDragEnd={onDragEnd}
                        ref={el => (dropElements.current[index] = el)}
                        key={`${tio.id}.${tio.lap}`}
                        className={classNames(
                            "my-2 flex w-80 cursor-grab select-none items-center rounded-md border bg-white p-2.5 shadow-sm",
                            dragTarget === index && "opacity-50",
                        )}>
                        <div className="flex size-8 items-center justify-center rounded-full bg-gray-200">{index + 1}</div>
                        <div className="mx-2">
                            <div className="text-sm font-semibold">{tio.name}</div>
                            <div className="text-2xs font-semibold text-gray-500">{tio.description ?? "Some default description"}</div>
                        </div>
                        <div className="flex-grow"></div>
                        {tio.laps ? <div className="shrink-0 text-xs font-semibold">LAP: {tio.lap + 1}</div> : null}
                        <Icon className="ml-1 shrink-0" size={1} path={mdiDrag}></Icon>
                    </div>
                    {index === timesInOrder.length - 1 && (
                        <DropTarget
                            onDragEnter={onDragEnter(index + 1)}
                            onDragOver={onDragOver(index + 1)}
                            onDragLeave={onDragLeave}
                            onDrop={onDrop(index + 1)}
                            dropTarget={dropTarget}
                            index={index + 1}
                            dragStarted={dragStarted}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export const TimingPoints = () => {
    const raceId = useCurrentRaceId();
    const { data: timingPoints, refetch: refetchTimingPoints } = trpc.timingPoint.timingPoints.useQuery(
        { raceId: raceId },
        { initialData: [] },
    );
    const t = useTranslations();
    const router = useRouter();

    const { data: timingPointsOrder, refetch: refetchOrder } = trpc.timingPoint.timingPointsOrder.useQuery(
        { raceId: raceId },
        {
            initialData: [],
        },
    );

    const cols: PoorDataTableColumn<TimingPoint>[] = [
        { field: "name", headerName: t("pages.timingPoints.sections.grid.columns.name"), sortable: true },
        {
            field: "shortName",
            headerName: t("pages.timingPoints.sections.grid.columns.shortName"),
        },
        {
            field: "type",
            headerName: t("pages.timingPoints.sections.grid.columns.type"),
        },
        {
            field: "laps",
            headerName: t("pages.timingPoints.sections.grid.columns.laps"),
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

    const sortedTimingPoints = timingPointsOrder.map(point => timingPoints.find(tp => point === tp.id)!);

    const timesInOrder = sortedTimingPoints.flatMap(tp => createRange({ from: 0, to: tp.laps }).map(lap => ({ ...tp, lap })));

    const onTimesInOrderChange = (times: TimingPointWithLap[]) => {
        console.log(times);
    };

    const onTimingPointCreated = () => {
        void refetchTimingPoints();
        void refetchOrder();
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
                    <PoorDataTable
                        columns={cols}
                        hideColumnsChooser
                        getRowId={d => d.id}
                        gridName="timing-points"
                        data={sortedTimingPoints}
                    />
                </div>
                <div className="my-8">
                    <SectionHeader
                        title={t("pages.timingPoints.sections.order.header.title")}
                        description={t("pages.timingPoints.sections.order.header.description")}
                    />
                    <div>
                        {timesInOrder.length > 0 && (
                            <TimingPointsOrder onTimesInOrderChange={onTimesInOrderChange} initialTimesInOrder={timesInOrder} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
