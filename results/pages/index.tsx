import Head from "next/head";
import { TimerState } from "@set/timer/store";

const Slogan = () => (
    <div style={{ backgroundImage: "url('assets/kocierz.jpg')" }} className="w-full h-128 bg-bottom bg-cover"></div>
);

type Props = {
    state: TimerState;
};

const Index = ({}: Props) => {
    return (
        <>
            <Head>
                <title>Rura na Kocierz</title>
            </Head>

            <div>
                <Slogan />
            </div>
        </>
    );
};

export default Index;
