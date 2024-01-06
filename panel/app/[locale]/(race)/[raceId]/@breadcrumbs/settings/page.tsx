import { Breadcrumbs } from "components/breadcrumbs";
import { useTranslations } from "next-intl";

export default ({ params }: { params: { raceId: string } }) => {
    const t = useTranslations();

    return (
        <Breadcrumbs homePath={`/${params.raceId}`}>
            <Breadcrumbs.Item text={t("pages.settings.header.title")}></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};
