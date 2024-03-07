"use client";

import { mdiChevronRight, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { createRange } from "@set/utils/dist/array";
import classNames from "classnames";
import { type Route } from "next";
import { useTranslations } from "next-intl";
import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { PageHeader } from "src/components/page-headers";
import { TimingPointCreate } from "src/components/panel/timing-point/timing-point-create";
import { PoorModal } from "src/components/poor-modal";
import type { AppRouterOutputs } from "src/trpc";
import { getTimingPointIcon } from "src/utils";
import { useCurrentRaceId } from "../../../../../hooks";
import { trpc } from "../../../../../trpc-core";

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

// const isColliding = (element1: HTMLDivElement, element2: HTMLDivElement) => {
//     if (element1 === element2) return false;

//     const rect1 = element1.getBoundingClientRect();
//     const rect2 = element2.getBoundingClientRect();

//     const horizontalOverlap = !(rect1.right < rect2.left || rect1.left > rect2.right);

//     console.log(rect1.top);

//     const verticalOverlap = Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top);
//     // const halfHeight1 = rect1.height / 2;
//     const halfHeight2 = rect2.height / 2;

//     return horizontalOverlap && verticalOverlap >= halfHeight2;
// };

const isColliding = (
    dragElement: HTMLDivElement,
    dropElement: HTMLDivElement,
    dropElements: (HTMLDivElement | null)[],
    dropElementsRects: (DOMRect | null)[],
    dragElementRect: DOMRect,
    dY: number,
) => {
    if (dragElement === dropElement) return false;

    const dropElementIndex = dropElements.indexOf(dropElement);

    const dragRect = dragElement.getBoundingClientRect();
    const dropRect = dropElementsRects[dropElementIndex]!;

    const horizontalOverlap = !(dragRect.right < dropRect.left || dragRect.left > dropRect.right);

    // console.log(dragRect.top);

    const dropRectCenter = dropRect.top + dropRect.height / 2;

    const result =
        horizontalOverlap &&
        (dY > 0
            ? dragElementRect.top < dropRect.top && dragRect.bottom >= dropRectCenter
            : dragElementRect.top > dropRect.top && dragRect.top <= dropRectCenter);

    // if (result) console.log(dY > 0, dragRect.bottom >= dropRectCenter, dragRect.top <= dropRectCenter);

    return result;
};

type TimingPointWithLap = TimingPoint & { lap: number };

const TimingPointsOrder = ({ timesInOrder }: { timesInOrder: TimingPointWithLap[] }) => {
    const dragStartX = useRef<number>(0);
    const dragStartY = useRef<number>(0);
    const dragElementRect = useRef<DOMRect | null>(null);
    const dragElement = useRef<HTMLDivElement | null>(null);
    const dropElement = useRef<HTMLDivElement | null>(null);
    const dropElements = useRef<(HTMLDivElement | null)[]>([]);
    const dropElementsRects = useRef<(DOMRect | null)[]>([]);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, targetElement: HTMLDivElement | null) => {
        if (!targetElement) return;
        dragElement.current = targetElement;
        dragElementRect.current = targetElement.getBoundingClientRect();
        dragStartX.current = e.clientX;
        dragStartY.current = e.clientY;

        const targetElementIndex = dropElements.current.indexOf(targetElement);
        dropElementsRects.current = dropElements.current.map(el => el?.getBoundingClientRect() ?? null);

        dropElements.current
            .slice(targetElementIndex + 1)
            .forEach(el => (el!.style.transform = `translate(0px, ${dragElementRect.current!.height + 8}px)`));

        dropElements.current.forEach(el => el?.classList.add("transition-transform"));

        targetElement.style.position = "fixed";
        targetElement.style.top = `${dragElementRect.current.top}px`;
        targetElement.style.left = `${dragElementRect.current.left}px`;
        targetElement.style.willChange = "transform";
        targetElement.style.zIndex = "1000";
        targetElement.style.transition = "none";
    };

    const handlePointerUp = (_e: React.PointerEvent<HTMLDivElement>, targetElement: HTMLDivElement | null) => {
        if (!targetElement) return;
        dragElement.current = null;
        dropElement.current = null;
        dragStartX.current = 0;
        dragStartY.current = 0;

        dropElements.current.forEach(el => el?.classList.remove("transition-transform"));
        dropElements.current.forEach(el => el?.classList.remove("bg-red-200"));
        dropElements.current.forEach(el => (el!.style.transform = `translate(0px, 0px)`));

        targetElement.style.position = "relative";
        targetElement.style.top = `0px`;
        targetElement.style.left = `0px`;
        targetElement.style.willChange = "auto";
        targetElement.style.zIndex = "auto";
        targetElement.style.transition = "transform 0.2s";
        targetElement.style.transform = `translate(0px, 0px)`;
    };

    const handlePointerMove = (e: PointerEvent) => {
        if (!dragElement.current || !dragElementRect.current || !dragStartX.current || !dragStartY.current) return;

        const dX = e.clientX - dragStartX.current;
        const dY = e.clientY - dragStartY.current;

        const collidingItems = dropElements.current.filter(
            el =>
                el && isColliding(dragElement.current!, el, dropElements.current, dropElementsRects.current, dragElementRect.current!, dY),
        );

        const targetDropElement = dY > 0 ? collidingItems.at(-1) : collidingItems.at(0);

        if (targetDropElement && targetDropElement !== dropElement.current) {
            console.log("highlight-elements!");
            dropElement.current = targetDropElement;

            const dropElementIndex = dropElements.current.indexOf(dropElement.current);
            const dragElementIndex = dropElements.current.indexOf(dragElement.current);

            dropElements.current.forEach(el => el?.classList.remove("bg-red-200"));
            dropElements.current
                .slice(dragElementIndex + 1)
                .forEach(el => (el!.style.transform = `translate(0px, ${dragElementRect.current!.height + 8}px)`));
            // dropElements.current.forEach(el => (el!.style.transform = ""));

            const startIndex = dropElementIndex > dragElementIndex ? dragElementIndex + 1 : dropElementIndex;
            const endIndex = dropElementIndex > dragElementIndex ? dropElementIndex + 1 : dragElementIndex;

            const moveElements = dropElements.current.slice(startIndex, endIndex);

            // targetDropElement.style.marginTop = `${dragElementRect.current.height}px`;

            // const dragElementHeight =
            //     dropElementIndex > dragElementIndex
            //         ? -dragElement.current.getBoundingClientRect().height - 8
            //         : dragElement.current.getBoundingClientRect().height + 8;

            // moveElements.forEach(el => {
            //     el!.style.transform = `translateY(${dragElementHeight}px)`;
            // });

            moveElements.forEach(el => el!.classList.add("bg-red-200"));
            if (dY > 0) moveElements.forEach(el => (el!.style.transform = `translate(0px, 0px)`));
            else moveElements.forEach(el => (el!.style.transform = `translate(0px, ${dragElementRect.current!.height + 8}px)`));

            // const moveElements = dropElements.current.slice(index);
        }

        if (!targetDropElement) {
            dropElement.current = null;
            // dropElements.current.forEach(el => (el!.style.transform = ""));

            const dragElementIndex = dropElements.current.indexOf(dragElement.current);

            dropElements.current.slice(0, dragElementIndex).forEach(el => (el!.style.transform = `translate(0px, 0px)`));

            dropElements.current
                .slice(dragElementIndex + 1)
                .forEach(el => (el!.style.transform = `translate(0px, ${dragElementRect.current!.height + 8}px)`));

            dropElements.current.forEach(el => el?.classList.remove("bg-red-200"));
        }

        // const collidingElement = targetElements.current
        //     .concat(dropElements.current)
        //     .find(el => el && isColliding(dragElement.current!, el));

        // if (!collidingElement && dropElement.current) {
        //     console.log("clear--items");
        //     dropElement.current = null;
        //     dropElements.current.forEach(el => (el!.style.height = "0px"));
        // }

        // const collidingElementIsTargetElement = targetElements.current.includes(collidingElement!);

        // if (collidingElementIsTargetElement) {
        //     const index = targetElements.current.indexOf(dropElement.current);
        //     const ele = dropElements.current[index];
        //     const dragElementHeight = dragElement.current.getBoundingClientRect().height;
        //     ele!.style.height = dragElementHeight + "px";
        //     // dY = dY - dragElementHeight;
        //     console.log("move--items");
        // }

        // const heights = targetElements.current.map(el => (el ? el.getBoundingClientRect().height : 0));
        // console.log(heights);

        dragElement.current.style.transform = `translate(${dX}px, ${dY}px)`;
    };

    useEffect(() => {
        window.addEventListener("pointermove", handlePointerMove);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
        };
    }, []);

    return (
        <div className="bg-orange-100 p-16">
            {timesInOrder.map((tio, index) => (
                <React.Fragment key={`${tio.id}.${tio.lap}`}>
                    <div
                        ref={el => (dropElements.current[index] = el)}
                        onPointerDown={e => handlePointerDown(e, dropElements.current[index])}
                        onPointerUp={e => handlePointerUp(e, dropElements.current[index])}
                        key={`${tio.id}.${tio.lap}`}
                        className={classNames(
                            "relative mb-2 flex w-64 cursor-pointer select-none items-center rounded-md border-2 bg-gray-100 px-3 py-1.5",
                        )}>
                        <div className="size-8 shrink-0 rounded-full bg-orange-500"></div>
                        <div className="ml-3">
                            <div className="text-sm font-semibold">{tio.name}</div>
                            <div className="text-xs">{tio.description ?? "Some default description"}</div>
                        </div>
                        <div className="flex-grow"></div>
                    </div>
                </React.Fragment>
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

    const sortedTimingPoints = timingPointsOrder.map(point => timingPoints.find(tp => point === tp.id)!);

    const timesInOrder = timingPoints.flatMap(tp => createRange({ from: 0, to: tp.laps }).map(lap => ({ ...tp, lap })));

    return (
        <>
            <Head>
                <title>{t("pages.timingPoints.header.title")}</title>
            </Head>
            <div className="border-1 flex h-full flex-col border-solid border-gray-600">
                <PageHeader title={t("pages.timingPoints.header.title")} description={t("pages.timingPoints.header.description")} />
                <div className="flex">
                    <div className="hidden w-full max-w-md ">
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
                </div>
                <div>
                    <TimingPointsOrder timesInOrder={timesInOrder} />
                </div>
            </div>
        </>
    );
};
