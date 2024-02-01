"use client";
import { PageHeader } from "components/page-headers";
import { trpc } from "../../../../../trpc-core";

export const Hello = () => {
    const { data } = trpc.classification.classifications.useQuery({ raceId: 0 });
    if (!data) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <PageHeader title="Hi Page!" description="That is just a page for testing purposes" />
        </div>
    );
};
