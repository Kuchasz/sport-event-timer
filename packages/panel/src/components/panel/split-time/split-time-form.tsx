import { mdiExport } from "@mdi/js";
import Icon from "@mdi/react";
import { formatTimeWithMilliSec } from "@set/utils/dist/datetime";
import { useTranslations } from "next-intl";
import { PoorCombo } from "src/components/poor-combo";
import { Form, FormInput } from "src/components/form";
import { splitTimeSchema } from "src/modules/split-time/models";
import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
import { PoorButton } from "../../poor-button";
import { PoorSelect } from "../../poor-select";
import { PoorFullTimepicker } from "../../poor-timepicker";
import { PoorChip } from "src/components/poor-chip";

type SplitTime = AppRouterInputs["splitTime"]["update"];

const SuggestedSplitTime = ({ time, onApply }: { time?: number; onApply: (time: number) => void }) => (
    <div className="group flex items-center text-blue-600 transition-colors">
        <PoorChip color="blue" label={formatTimeWithMilliSec(time)} />
        <span onClick={() => onApply(time ?? 0)} className="ml-1 mr-3 cursor-pointer rounded-full p-1 hover:bg-blue-50">
            <Icon size={0.8} path={mdiExport} />
        </span>
    </div>
);

type SplitTimeFormProps = {
    onReject: () => void;
    onResolve: (splitTime: SplitTime) => void;
    initialSplitTime: SplitTime;
    bibNumbers: string[];
    raceDate: number;
    isLoading: boolean;
    splits: AppRouterOutputs["split"]["splitsInOrder"];
    estimatedTime?: number;
};

export const SplitTimeForm = ({
    onReject,
    onResolve,
    initialSplitTime,
    bibNumbers,
    isLoading,
    raceDate,
    splits,
    estimatedTime,
}: SplitTimeFormProps) => {
    const t = useTranslations();

    return (
        <Form<SplitTime> initialValues={initialSplitTime} validationSchema={splitTimeSchema} onSubmit={onResolve}>
            {splits?.length && (
                <FormInput<SplitTime, "splitId">
                    label={t("pages.splitTimes.form.split.label")}
                    description={t("pages.splitTimes.form.split.description")}
                    className="flex-1"
                    render={({ value, onChange }) => (
                        <PoorSelect
                            initialValue={value}
                            items={splits}
                            placeholder={t("pages.splitTimes.form.split.placeholder")}
                            nameKey="name"
                            valueKey="id"
                            onChange={onChange}
                        />
                    )}
                    name="splitId"
                />
            )}
            <div className="p-2"></div>
            <FormInput<SplitTime, "bibNumber">
                label={t("pages.splitTimes.form.bibNumber.label")}
                description={t("pages.splitTimes.form.bibNumber.description")}
                className="flex-1"
                render={({ value, onChange }) => (
                    <PoorCombo
                        initialValue={value}
                        placeholder={t("pages.splitTimes.form.bibNumber.placeholder")}
                        items={bibNumbers}
                        onChange={onChange}
                        allowCustomValue
                        notFoundMessage={t("pages.splitTimes.form.bibNumber.notFoundMessage")}
                    />
                )}
                name="bibNumber"
            />
            <div className="p-2"></div>
            <FormInput<SplitTime, "time">
                label={t("pages.splitTimes.form.estimatedTime.label")}
                description={t("pages.splitTimes.form.estimatedTime.description")}
                className="flex-1"
                render={({ onChange }) => (
                    <SuggestedSplitTime
                        time={estimatedTime}
                        onApply={time => {
                            onChange({ target: { value: time } });
                        }}
                    />
                )}
                name="time"
            />
            <div className="p-2"></div>
            <FormInput<SplitTime, "time">
                label={t("pages.splitTimes.form.time.label")}
                description={t("pages.splitTimes.form.time.description")}
                className="flex-1"
                render={({ value, onChange }) => (
                    <PoorFullTimepicker className="font-mono" date={raceDate} value={value} onChange={onChange} />
                )}
                name="time"
            />
            <div className="mt-4 flex justify-between">
                <PoorButton onClick={onReject} outline>
                    {t("shared.cancel")}
                </PoorButton>
                <PoorButton loading={isLoading} type="submit">
                    {t("shared.save")}
                </PoorButton>
            </div>
        </Form>
    );
};
