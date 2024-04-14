import { Breadcrumbs } from "src/components/breadcrumbs";
import { useTranslations } from "next-intl";

const SplitsListBreadcrumbs = ({ raceId }: { raceId: string }) => {
    const t = useTranslations();

    return (
        <Breadcrumbs homePath={`/${raceId}`}>
            <Breadcrumbs.Item href={`/${raceId}/splits`} text={t("pages.splits.header.title")}></Breadcrumbs.Item>
        </Breadcrumbs>
    );
};

export default ({ params }: { params: { raceId: string } }) => {
    return <SplitsListBreadcrumbs raceId={params.raceId} />;
};
