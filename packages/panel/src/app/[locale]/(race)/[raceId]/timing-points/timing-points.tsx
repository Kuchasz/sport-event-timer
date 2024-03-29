"use client";

import { mdiChevronRight, mdiDrag, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { createRange } from "@set/utils/dist/array";
import classNames from "classnames";
import { type Route } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { PageHeader, SectionHeader } from "src/components/page-headers";
import { TimingPointCreate } from "src/components/panel/timing-point/timing-point-create";
import { PoorModal } from "src/components/poor-modal";
import type { AppRouterOutputs } from "src/trpc";
import { getTimingPointIcon } from "src/utils";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";
import { Button } from "src/components/button";
import { PoorDataTable, type PoorDataTableColumn } from "src/components/poor-data-table";
import { PoorActions } from "src/components/poor-actions";

type TimingPoint = AppRouterOutputs["timingPoint"]["timingPoint"];

const TimingPointCard = ({
    onCreate,
    index,
    raceId,
    timingPoint,
    isFirst,
    isLast,
}: {
    onCreate: () => void;
    index: number;
    raceId: number;
    isFirst: boolean;
    isLast: boolean;
    timingPoint: TimingPoint;
}) => {
    const t = useTranslations();

    return (
        <div className="flex flex-col">
            {!isFirst && (
                <div className="flex flex-col items-center">
                    <PoorModal
                        onResolve={onCreate}
                        title={t("pages.timingPoints.create.title")}
                        component={TimingPointCreate}
                        componentProps={{ raceId: raceId, index, onReject: () => {} }}>
                        <button className="my-1 flex w-full cursor-pointer items-center self-center rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-600">
                            <Icon path={mdiPlus} size={0.7} />
                            <span className="ml-1.5">{t("pages.timingPoints.create.button")}</span>
                        </button>
                    </PoorModal>
                </div>
            )}

            <div>
                <div className="my-1 flex w-full items-center rounded-3xl bg-gray-100 p-1">
                    <div className={classNames("flex rounded-lg px-6 py-4")}>
                        <div
                            className={classNames(`mr-4 self-center rounded-2xl bg-gray-300 p-3 text-white`, {
                                ["rotate-90"]: !isLast,
                            })}>
                            <Icon path={getTimingPointIcon(isFirst, isLast)} size={0.8} />
                        </div>
                        <div className="flex flex-col">
                            <h4 className={classNames("text-md font-bold")}>{timingPoint.name}</h4>
                            <span className={classNames("text-sm text-gray-400")}>
                                {timingPoint.description ?? "Timing point where time should be registered"}
                            </span>
                        </div>
                    </div>
                    <div className="flex-grow"></div>
                    <Link
                        className="mr-4 rounded-full p-1 hover:bg-white"
                        href={`/${timingPoint.raceId}/timing-points/${timingPoint.id}` as Route}>
                        <Icon path={mdiChevronRight} size={1}></Icon>
                    </Link>
                </div>
            </div>
        </div>
    );
};

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
        className={classNames("-z-1 absolute -mt-5 flex h-8 w-64 items-center transition-colors", dropTarget === index ? "" : "", {
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
                            "my-2 flex w-64 cursor-grab select-none items-center rounded-md border bg-white p-1.5 shadow-sm",
                            dragTarget === index && "opacity-50",
                        )}>
                        <Icon className="shrink-0" size={1} path={mdiDrag}></Icon>
                        <div className="ml-1">
                            <div className="text-sm font-semibold">{tio.name}</div>
                            <div className="text-2xs font-semibold text-gray-500">{tio.description ?? "Some default description"}</div>
                        </div>
                        <div className="flex-grow"></div>
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
            field: "id",
            headerName: t("pages.timingPoints.sections.grid.columns.actions"),
            sortable: false,
            cellRenderer: _d => (
                <PoorActions>
                    {/* <PoorModal
                        onResolve={() => refetchAccessKeys()}
                        title={t("pages.timingPoints.accessUrls.edit.confirmation.title")}
                        component={TimingPointAccessUrlEdit}
                        componentProps={{
                            editedTimingPointAccessKey: d,
                            timingPointId: timingPoint.id,
                            raceId: timingPoint.raceId,
                            onReject: () => {},
                        }}>
                        <NewPoorActionsItem
                            name={t("pages.timingPoints.accessUrls.edit.title")}
                            description={t("pages.timingPoints.accessUrls.edit.description")}
                            iconPath={mdiPencilOutline}></NewPoorActionsItem>
                    </PoorModal>
                    <PoorConfirmation
                        onAccept={() => deleteAccessKey(d)}
                        title={t("pages.timingPoints.accessUrls.delete.confirmation.title")}
                        message={t("pages.timingPoints.accessUrls.delete.confirmation.text", { name: d.name })}
                        isLoading={deleteTimingPointAccessKeyMutation.isLoading}>
                        <NewPoorActionsItem
                            name={t("pages.timingPoints.accessUrls.delete.title")}
                            description={t("pages.timingPoints.accessUrls.delete.description")}
                            iconPath={mdiTrashCanOutline}></NewPoorActionsItem>
                    </PoorConfirmation>
                    <NewPoorActionsItem
                        onClick={generateAccessUrl}
                        name={t("pages.timingPoints.accessUrls.copy.title")}
                        description={t("pages.timingPoints.accessUrls.copy.description")}
                        iconPath={mdiClipboardFileOutline}></NewPoorActionsItem> */}
                </PoorActions>
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
                {/* <div className="flex">
                    <div className="w-full max-w-md ">
                        {sortedTimingPoints?.map((e, index) => (
                            <TimingPointCard
                                key={e.id}
                                index={index}
                                raceId={raceId}
                                onCreate={() => {
                                    void refetchTimingPoints();
                                    void refetchOrder();
                                }}
                                timingPoint={e}
                                isFirst={index === 0}
                                isLast={index === sortedTimingPoints.length - 1}
                            />
                        ))}
                    </div>
                </div> */}
                <div className="mt-8">
                    <SectionHeader
                        title={t("pages.timingPoints.accessUrls.header.title")}
                        description={t("pages.timingPoints.accessUrls.header.description")}
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
