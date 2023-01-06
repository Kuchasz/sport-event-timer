import Head from "next/head";
import { TimerState } from "@set/timer/dist/store";
import { signIn, useSession } from "next-auth/react";
import { Button } from "components/button";

const AuthShowcase = () => {
    const { data: sessionData } = useSession();

    return (
        <div className="flex flex-col items-center justify-center gap-2 hidden">
            {sessionData && (
                <p className="text-2xl text-blue-500">
                    You are logged in {sessionData?.user?.name} <br />
                </p>
            )}
            <Button
                className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
                onClick={sessionData ? () => null : () => signIn()}
            >
                {sessionData ? "" : "Sign in"}
            </Button>
        </div>
    );
};

type Props = {
    state: TimerState;
};

const Index = ({}: Props) => {
    return (
        <>
            <Head>
                <title>Aktualności</title>
            </Head>
            <div>
                <AuthShowcase />
            </div>
            <div className="flex w-full justify-center">
                <div className="w-full flex flex-col sm:flex-row py-4 px-12"></div>
            </div>
            <div className="flex w-full relative justify-center overflow-hidden">
                <div className="w-full my-12 max-w-6xl flex flex-col items-start justify-center"></div>
            </div>
        </>
    );
};

export default Index;

export { getSecuredServerSideProps as getServerSideProps } from "../../auth";