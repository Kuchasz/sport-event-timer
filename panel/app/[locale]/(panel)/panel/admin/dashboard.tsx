import { PageHeader } from "components/page-header";

export const Dashboard = () => {
    return (
        <>
            <PageHeader title="Admin Dashboard" description="Monitor what is the most important" />
            <div className="flex w-full relative justify-center overflow-hidden">
                <div className="w-full my-12 max-w-6xl flex flex-col items-start justify-center"></div>
            </div>
        </>
    );
};