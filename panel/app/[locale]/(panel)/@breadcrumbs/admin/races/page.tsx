import { Breadcrumbs } from "components/breadcrumbs";
import { useTranslations } from "next-intl";

export default () => {
    const t = useTranslations();
    return (
        <Breadcrumbs>
            <Breadcrumbs.Item href={`/admin`} text={t("pages.admin.header.title")}></Breadcrumbs.Item>
            <Breadcrumbs.Item text={t('pages.admin.races.title')}></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};
