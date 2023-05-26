import { trpc } from "connection";
import Head from "next/head";
import { ReactNode } from "react";

const DashboardCard = ({ title, children }: { title: string; children: ReactNode }) => (
    <div className="self-start w-64 h-64 shadow-md m-2 px-6 py-4 rounded-md flex flex-col items-center">
        <div className="self-start font-semibold">{title}</div>
        <div className="w-full h-full flex items-center justify-center">{children}</div>
    </div>
);

const Index = () => {
    const { data: dashboardData } = trpc.race.raport.useQuery();

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <div className="border-1 flex flex-wrap h-full border-gray-600 border-solid">
                <DashboardCard title="Number of races">
                    <div className="flex flex-col items-center">
                        <div className="text-5xl my-2 font-semibold">{dashboardData?.totalRaces}</div>
                        <div className="text-gray-400 font-normal text-sm">Future races: {dashboardData?.futureRaces}</div>
                        <div className="text-gray-400 font-normal text-sm">Past races: {dashboardData?.pastRaces}</div>
                    </div>
                </DashboardCard>
                {dashboardData?.nextRace && (
                    <DashboardCard title="Incoming race">
                        <div className="flex flex-col items-center">
                            <div className="self-end font-semibold text-center">{dashboardData.nextRace.date?.toLocaleDateString()}</div>
                            <div className="text-2xl my-2 font-semibold text-center">{dashboardData.nextRace.name}</div>
                            <div className="text-gray-400 font-normal text-sm">
                                Registered: {dashboardData?.nextRace.registeredPlayers} {dashboardData.nextRace.playersLimit && <span>/ {dashboardData.nextRace.playersLimit}</span>}
                            </div>
                            <div className="text-gray-400 font-normal text-sm">
                                Registration:
                                {dashboardData?.nextRace.registrationEnabled ? (
                                    <span className="font-semibold text-green-600">enabled</span>
                                ) : (
                                    <span className="font-semibold text-red-600">disabled</span>
                                )}
                            </div>
                        </div>
                    </DashboardCard>
                )}
            </div>
        </>
    );
};

export default Index;

export { getSecuredServerSideProps as getServerSideProps } from "../../auth";
