import Head from "next/head";
import { TimerState } from "@set/timer/store";

const Slogan = () => (
    <div
        style={{ backgroundImage: "url('assets/kocierz.jpg')" }}
        className="flex w-full h-128 text-white bg-bottom bg-cover justify-center"
    >
        <div className="w-full max-w-5xl flex flex-col items-start justify-center">
            <div className="text-5xl uppercase font-bold">Rura na Kocierz 2022</div>
            <div className="py-4">Ambasador Marta Lach. Mistrzyni Polski, Olimpijka Tokio 2020.</div>
            <div className="text-xl drop-shadow-xl">
                <strong>09.04.2022</strong> Time Trial
            </div>
            <div className="text-xl drop-shadow-xl">
                <strong>10.04.2022</strong> Wyścig ze startu wspólnego
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
