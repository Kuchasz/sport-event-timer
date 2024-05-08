import { Button } from "../../button";
import { PoorFullTimepicker } from "../../poor-timepicker";
import { PoorSelect } from "../../poor-select";
import type { AppRouterInputs, AppRouterOutputs } from "src/trpc";
import { Form, FormInput } from "src/form";
import { splitTimeSchema } from "src/modules/split-time/models";
import { PoorCombo } from "src/components/poor-combo";
import { useTranslations } from "next-intl";

type SplitTime = AppRouterInputs["splitTime"]["update"];

type SplitTimeFormProps = {
    onReject: () => void;
    onResolve: (splitTime: SplitTime) => void;
    initialSplitTime: SplitTime;
    bibNumbers: string[];
    raceDate: number;
    isLoading: boolean;
    splits: AppRouterOutputs["split"]["splitsInOrder"];
    playersEstimatedTime?: number;
    distanceEstimatedTime?: number;
};

export const SplitTimeForm = ({
    onReject,
    onResolve,
    initialSplitTime,
    bibNumbers,
    isLoading,
    raceDate,
    splits,
    playersEstimatedTime,
    distanceEstimatedTime,
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
                    />
                )}
                name="bibNumber"
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

            {playersEstimatedTime || distanceEstimatedTime ? (
                <>
                    <div className="p-2"></div>
                    <div>
                        {playersEstimatedTime && <div>{playersEstimatedTime}</div>}
                        {distanceEstimatedTime && <div>{distanceEstimatedTime}</div>}
                    </div>
                </>
            ) : null}

            <div className="mt-4 flex justify-between">
                <Button onClick={onReject} outline>
                    {t("shared.cancel")}
                </Button>
                <Button loading={isLoading} type="submit">
                    {t("shared.save")}
                </Button>
            </div>
        </Form>
    );
};
