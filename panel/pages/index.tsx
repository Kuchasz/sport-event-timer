import Head from "next/head";
import { TimerState } from "@set/timer/dist/store";

type Props = {
    state: TimerState;
};

const Index = ({}: Props) => {
    return (
        <>
            <Head>
                <title>Aktualności</title>
            </Head>
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
