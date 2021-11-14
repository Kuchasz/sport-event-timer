import Head from "next/head";
import { TimerState } from "@set/timer/store";

const fakeContent = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas et mattis enim. Vivamus malesuada sapien mauris, sed dictum metus placerat a. Morbi et sollicitudin sapien. Phasellus fringilla augue a erat imperdiet, sit amet sodales lectus condimentum. Mauris et ante vulputate massa consequat placerat ac tempus lorem. Praesent id est ligula. Vivamus arcu tortor, imperdiet ut venenatis laoreet, condimentum vel velit. Duis urna erat, posuere sit amet quam vitae, bibendum tincidunt lorem. Aliquam pretium mattis mattis. Phasellus volutpat consequat magna, eu sagittis tellus blandit sed. Morbi vulputate, arcu eget pulvinar consectetur, felis felis lacinia risus, at porttitor felis mi ac est. Etiam congue cursus nibh, non ornare elit feugiat vel. Aenean tincidunt magna purus, nec rhoncus tellus ornare in. Suspendisse non iaculis enim. Nullam porta congue accumsan.

Praesent efficitur placerat velit, sed egestas leo bibendum at. Praesent pulvinar nisi mauris, et suscipit dolor iaculis vitae. Donec ut lectus ac justo maximus molestie. Vestibulum ultricies gravida ornare. Vestibulum et velit id libero rhoncus fringilla at vel quam. Nam nibh lacus, aliquet at neque scelerisque, suscipit scelerisque ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed in metus ut arcu dignissim bibendum. Nullam sed magna venenatis, hendrerit libero sit amet, imperdiet odio. Morbi non leo dapibus, tempor mauris quis, auctor massa. Pellentesque eget ex lacinia, consectetur dui sit amet, pellentesque orci. Etiam eget sodales dolor. Duis tincidunt dignissim ullamcorper. Pellentesque vitae dui sed neque luctus egestas sit amet id orci. Nunc pellentesque magna orci, porttitor lacinia nunc ultricies at. Fusce convallis felis tellus, id viverra libero faucibus molestie.

Nam faucibus et odio quis malesuada. In eleifend, justo a mattis tempus, nulla diam congue nunc, eu interdum risus justo eget nibh. Etiam justo dui, vulputate a nulla a, venenatis maximus odio. Proin id aliquet augue. Aliquam non tellus non ligula pretium sagittis. Aenean a elit semper, ullamcorper nulla et, consequat justo. Cras auctor tempor lorem, quis pretium velit sodales a. Fusce lobortis tellus ipsum, non laoreet magna fermentum sit amet. Vivamus posuere laoreet purus ac volutpat. Aliquam placerat laoreet lectus.

Vivamus tellus ipsum, blandit sed ante eget, porttitor rhoncus odio. Nunc vitae arcu tempus lorem mollis laoreet vel in erat. Proin viverra neque id sem condimentum consequat. Suspendisse eu laoreet erat. Donec laoreet ut tortor elementum posuere. Vestibulum ante lorem, tempor et erat sed, tristique pretium odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus fringilla tristique magna, et finibus massa eleifend vitae. Proin sed tempus leo. Suspendisse quis rutrum odio. Cras dignissim at risus a faucibus. Vestibulum eu velit id quam mollis dignissim sed ac libero. Proin rutrum, quam sed auctor consequat, diam nisl hendrerit lorem, nec venenatis massa odio et nibh. Mauris tellus enim, luctus et mi et, blandit facilisis neque.

Curabitur eleifend in augue in ultricies. Aliquam feugiat volutpat sapien, nec finibus neque iaculis et. Donec facilisis leo ligula, eget faucibus tellus maximus non. Donec a tortor eget urna pellentesque consequat. Praesent quis magna in neque porta gravida ut vel tellus. Sed pretium sit amet arcu nec varius. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aliquam lacus felis, iaculis eget ultricies in, scelerisque non elit. Etiam euismod metus cursus libero sodales, a commodo ex dictum. Phasellus at neque fermentum, convallis nibh vel, tincidunt lacus. Vivamus id egestas elit, ac posuere nibh. Suspendisse quis nunc ante. Suspendisse arcu est, rutrum a lobortis sed, sollicitudin eget est.`;

const fakeNews = [
    {
        date: new Date(Date.parse("2021-10-25 12:57")),
        photo: "rusza-edycja-2022.jpg",
        title: "Rusza edycja 2022!",
        content: fakeContent,
        excerpt:
            "Keszcze więcej wrażeń, jeszcze większy rozmach. W 2022 roku widzimy się dwa dni z rzędu! 09.04 - Time Trial, 10.04 - Wyścig ze startu wspólnego"
    },
    {
        date: new Date(Date.parse("2021-11-01 15:28")),
        photo: "ruszaja-zapisy-do-zawodow-2022.jpg",
        title: "Ruszaja zapisy do zawodów 2022",
        content: fakeContent,
        excerpt: "Rura na kocierz w przyszlym roku odbedzie sie na wiosne dlatego zapisu uruchamiamy juz teraz!"
    },
    {
        date: new Date(Date.parse("2021-11-07 06:13")),
        photo: "film-z-prezentacji-trasy.jpg",
        title: "Film z prezentacji trasy",
        content: fakeContent,
        excerpt:
            "Mapki i slowo pisane nie do wszystkich przemawiaja, przygotowalismy video prezentacje tegorocznej trasy wyscigu!"
    },
    {
        date: new Date(Date.parse("2021-11-12 18:09")),
        photo: "nowy-sponsor-zawodow-xyz-com.jpg",
        title: "Nowy sponsor zawodów - XYZ.com",
        content: fakeContent,
        excerpt:
            "Po negocjacjach w koncu udalo nam sie dojsc do konsensusu, nawiazalismy wspolprace z kolejnym sponsorem - tym razem jest to XYZ.com"
    }
];

const Slogan = ({ article }: { article: typeof fakeNews[0] }) => (
    <div
        style={{ backgroundImage: `url(assets/posts/${article.photo})` }}
        className="flex w-full h-128 uppercase text-white bg-bottom bg-cover justify-center"
    >
        <div className="w-full max-w-6xl flex flex-col items-start justify-center">
            <span className="font-semibold">{article.date.toLocaleDateString()}</span>
            <div className="text-5xl font-semibold">{article.title}</div>
            <span className="mt-4 font-semibold">{article.excerpt}</span>
            <span className="mt-4 text-sm transition-colors duration-500 cursor-pointer border-2 hover:bg-orange-500 hover:border-orange-500 font-semibold px-8 py-2 border-white rounded-md">
                CZYTAJ WIĘCEJ
            </span>
            {/* <div className="text-3xl drop-shadow-xl">
                <strong>09.04.2022</strong> <span className="text-xl">Time Trial</span>
            </div>
            <div className="text-3xl drop-shadow-xl">
                <strong>10.04.2022</strong> <span className="text-xl">Wyścig ze startu wspólnego</span>
            </div> */}
        </div>
    </div>
);

const SneakPeak = ({ article }: { article: typeof fakeNews[0] }) => (
    <div className="w-1/2 flex flex-col rounded-md group overflow-hidden justify-end mx-4 my-4 relative">
        <div
            className="absolute w-full transition-transform group-hover:scale-105 duration-500 h-full bg-center bg-cover brightness-50"
            style={{ backgroundImage: `url(assets/posts/${article.photo})`, zIndex: -1 }}
        ></div>
        <div className="p-6 pt-40 flex flex-col text-white">
            <span className="font-semibold">{article.date.toLocaleDateString()}</span>
            <h3 className="font-bold self-start duration-500 w-auto uppercase transition-colors cursor-pointer hover:text-orange-500 text-2xl">
                {article.title}
            </h3>
            <h4 className="mt-4">{article.excerpt}</h4>
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

            <Slogan article={fakeNews[0]} />
            <div className="flex w-full justify-center">
                <div className="w-full flex py-4 px-12">
                    {fakeNews.slice(1, 4).map((n) => (
                        <SneakPeak key={n.title} article={n} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Index;
