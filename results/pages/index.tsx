import Head from "next/head";
import { TimerState } from "@set/timer/store";

const Slogan = () => (
    <div
        style={{ backgroundImage: "url('assets/kocierz.jpg')" }}
        className="flex w-full h-128 uppercase text-white bg-bottom bg-cover justify-center"
    >
        <div className="w-full max-w-5xl flex flex-col items-start justify-center">
            <div className="text-5xl font-semibold">rusza edycja 2022!</div>
            <span className="mt-2 mb-8 font-semibold">
                Jeszcze więcej wrażeń, jeszcze większy rozmach. W 2022 roku widzimy się dwa dni z rzędu!
            </span>
            <div className="text-3xl drop-shadow-xl">
                <strong>09.04.2022</strong> <span className="text-xl">Time Trial</span>
            </div>
            <div className="text-3xl drop-shadow-xl">
                <strong>10.04.2022</strong> <span className="text-xl">Wyścig ze startu wspólnego</span>
            </div>
        </div>
    </div>
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

            <Slogan />
        </>
    );
};

export default Index;
