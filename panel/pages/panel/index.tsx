import { trpc } from "connection";
import Head from "next/head";

const Index = () => {
    const { data: dashboardData } = trpc.race.raport.useQuery();

    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                <div className="self-start shadow-md p-4 rounded-md flex flex-col items-center">
                    <div className="font-semibold text-3xl">{dashboardData?.numberOfRaces}</div>
                    <div>number of races</div>
                </div>
            </div>
        </>
    );
};

export default Index;

export { getSecuredServerSideProps as getServerSideProps } from "../../auth";
