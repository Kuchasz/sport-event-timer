import Head from "next/head";
import Link from "next/link";
import { DateAdded } from "../components/date-added";
import { posts } from "./artykul/posts";
import { TimerState } from "@set/timer/store";

const Slogan = ({ article }: { article: typeof posts[0] }) => (
    <div
        style={{ backgroundImage: `url(/assets/posts/${article.photo})` }}
        className="flex w-full h-128 uppercase text-white bg-bottom bg-cover justify-center"
    >
        <div className="w-full max-w-6xl flex flex-col items-start justify-center">
            <DateAdded date={article.date} />
            <div className="text-5xl font-semibold">{article.title}</div>
            <span className="mt-4 font-semibold">{article.excerpt}</span>
            <Link href={`artykul/${article.alias}`}>
                <span className="mt-4 text-sm transition-colors duration-500 cursor-pointer border-2 hover:bg-orange-500 hover:border-orange-500 font-semibold px-8 py-2 border-white rounded-md">
                    CZYTAJ WIĘCEJ
                </span>
            </Link>
            {/* <div className="text-3xl drop-shadow-xl">
                <strong>09.04.2022</strong> <span className="text-xl">Time Trial</span>
            </div>
            <div className="text-3xl drop-shadow-xl">
                <strong>10.04.2022</strong> <span className="text-xl">Wyścig ze startu wspólnego</span>
            </div> */}
        </div>
    </div>
);

const SneakPeak = ({ article }: { article: typeof posts[0] }) => (
    <div className="w-1/2 flex flex-col rounded-md group overflow-hidden justify-end mx-4 my-4 relative">
        <div
            className="absolute w-full transition-transform group-hover:scale-105 duration-500 h-full bg-center bg-cover brightness-50"
            style={{ backgroundImage: `url(/assets/posts/${article.photo})`, zIndex: -1 }}
        ></div>
        <div className="p-6 pt-40 flex flex-col text-white">
            <Link href={`artykul/${article.alias}`}>
                <h3 className="font-bold self-start duration-500 w-auto uppercase transition-colors cursor-pointer hover:text-orange-500 text-2xl">
                    {article.title}
                </h3>
            </Link>
            <h4 className="my-4">{article.excerpt}</h4>
            <DateAdded date={article.date} />
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
                <title>Aktualności</title>
            </Head>

            <Slogan article={posts[0]} />
            <div className="flex w-full justify-center">
                <div className="w-full flex py-4 px-12">
                    {posts.slice(1, 4).map((n) => (
                        <SneakPeak key={n.title} article={n} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Index;
