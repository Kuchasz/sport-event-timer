import { Breadcrumbs } from "components/breadcrumbs";
import { useTranslations } from "next-intl";

export default () => {
    const t = useTranslations();
    return (
        <Breadcrumbs>
            <Breadcrumbs.Item text={t("pages.races.header.title")}></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};
