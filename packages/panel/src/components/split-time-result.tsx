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
import { PoorChip } from "./poor-chip";

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
        <div className={classNames("flex items-center font-mono font-medium", splitTime?.manual ? "" : "")}>
            {splitTime?.manual ? (
                <Tooltip>
                    <TooltipTrigger>
                        <PoorChip label={formatTimeWithMilliSec(splitTime?.time)} color="green" />
                    </TooltipTrigger>
                    <TooltipContent>{t("pages.splitTimes.manual.description")}</TooltipContent>
                </Tooltip>
            ) : (splitTime?.time ?? 0) > 0 ? (
                <PoorChip label={formatTimeWithMilliSec(splitTime?.time)} color="gray" />
            ) : (
                <PoorChip label={formatTimeWithMilliSec(splitTime?.time)} color="orange" />
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
                    destructive
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
                <span className="ml-2 flex items-center opacity-10">
                    <Icon size={0.75} path={mdiReload} />
                </span>
            )}
        </div>
    );
};
