import { Title } from "src/components/stopwatch/title";
import { useTranslations } from "next-intl";

export default function () {
    const t = useTranslations();
    return <Title text={t("stopwatch.times.title.text")}></Title>;
}
