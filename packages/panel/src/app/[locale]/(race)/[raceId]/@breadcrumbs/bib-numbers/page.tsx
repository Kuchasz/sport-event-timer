import { Breadcrumbs } from "src/components/breadcrumbs";
import { useTranslations } from "next-intl";

export default ({ params }: { params: { raceId: string } }) => {
    const t = useTranslations();

    return (
        <Breadcrumbs homePath={`/${params.raceId}`}>
            <Breadcrumbs.Item text={t("pages.bibNumbers.header.title")}></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};
