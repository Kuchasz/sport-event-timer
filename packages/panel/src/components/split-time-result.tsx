"use client";

import { mdiClockEditOutline, mdiClockPlusOutline, mdiReload } from "@mdi/js";
import Icon from "@mdi/react";
import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import { SplitTimeEdit } from "src/components/panel/split-time/split-time-edit";
import { PoorConfirmation, PoorModal } from "src/components/poor-modal";
import type { AppRouterInputs } from "src/trpc";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type RevertedSplitTime = AppRouterInputs["splitTime"]["revert"];

type SplitTimeResultTypes = {
    openResetDialog: (params: RevertedSplitTime) => Promise<void>;
    isLoading: boolean;
    splitTime?: { time: number; manual: boolean };
    bibNumber: string;
    refetch: () => void;
    raceId: number;
    raceDate: Date;
    splitId: number;
    classificationId: number;
};

export const SplitTimeResult = ({
    refetch,
    isLoading,
    raceId,
    raceDate,
    openResetDialog,
    splitTime,
    bibNumber,
    splitId,
    classificationId,
}: SplitTimeResultTypes) => {
    const t = useTranslations();
    return (
        <div className={classNames("flex font-mono font-medium", splitTime?.manual ? "" : "")}>
            {splitTime?.manual ? (
                <Tooltip>
                    <TooltipTrigger>
                        <span className="text-orange-500">{formatTimeWithMilliSec(splitTime?.time)}</span>
                    </TooltipTrigger>
                    <TooltipContent>{t("pages.splitTimes.manual.description")}</TooltipContent>
                </Tooltip>
            ) : (
                <span className="text-gray-700">{formatTimeWithMilliSec(splitTime?.time)}</span>
            )}

            <div className="flex-grow"></div>
            {splitTime && splitTime.time > 0 && (
                <PoorModal
                    onResolve={refetch}
                    title={t("pages.splitTimes.edit.title")}
                    component={SplitTimeEdit}
                    componentProps={{
                        editedSplitTime: {
                            bibNumber,
                            time: splitTime?.time,
                            splitId,
                            raceId,
                        },
                        raceId,
                        classificationId,
                        raceDate: raceDate.getTime(),
                        onReject: () => {},
                    }}>
                    <span className="ml-2 flex cursor-pointer items-center hover:text-red-600">
                        <Icon size={0.75} path={mdiClockEditOutline} />
                    </span>
                </PoorModal>
            )}
            {splitTime == null && (
                <PoorModal
                    onResolve={refetch}
                    title={t("pages.splitTimes.edit.title")}
                    component={SplitTimeEdit}
                    componentProps={{
                        editedSplitTime: {
                            bibNumber,
                            time: 0,
                            splitId,
                            raceId,
                        },
                        raceId,
                        classificationId,
                        raceDate: raceDate.getTime(),
                        onReject: () => {},
                    }}>
                    <span className="ml-2 flex cursor-pointer items-center hover:text-red-600">
                        <Icon size={0.75} path={mdiClockPlusOutline} />
                    </span>
                </PoorModal>
            )}
            {splitTime?.manual == true ? (
                <PoorConfirmation
                    title={t("pages.splitTimes.revert.confirmation.title")}
                    message={t("pages.splitTimes.revert.confirmation.text")}
                    onAccept={() =>
                        openResetDialog({
                            bibNumber,
                            splitId,
                        })
                    }
                    isLoading={isLoading}>
                    <span className="ml-2 flex cursor-pointer items-center hover:text-red-600">
                        <Icon size={0.75} path={mdiReload} />
                    </span>
                </PoorConfirmation>
            ) : (
                <span className="ml-2 flex opacity-10">
                    <Icon size={0.75} path={mdiReload} />
                </span>
            )}
        </div>
    );
};
