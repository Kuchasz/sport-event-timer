
import Head from "next/head";


const Index = () => {
    return (
        <>
            <Head>
                <title>Home</title>
            </Head>
            <div className="border-1 flex flex-col h-full border-gray-600 border-solid">
                Nothing here
            </div>
        </>
    );
};

export default Index;

export { getSecuredServerSideProps as getServerSideProps } from "../../auth";