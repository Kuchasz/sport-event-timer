import { Title } from "components/stopwatch/title";
import { useTranslations } from "next-intl";

export default function () {
    const t = useTranslations();
    return <Title text={t("stopwatch.reassign.title.text")}></Title>;
}
