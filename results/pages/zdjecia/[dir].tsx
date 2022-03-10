import Head from "next/head";
import Photos from "../../components/photos";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Item = {
    thumb: string;
    big: string;
    full: string;
};

type Directory = {
    dir: string;
    title: string;
    author: string;
    date: string;
    description: string;
    items: Item[];
};

const rura = (url: string) => `https://galleries.azureedge.net/rura/${url}`;

function Zdjecia() {
    const router = useRouter();
    const { dir } = router.query;

    const [directory, setDirectory] = useState<Directory>();

    useEffect(() => {
        if (dir === undefined) return;
        fetch(rura("index.json"))
            .then((x) => x.json())
            .then((dirs: Directory[]) => {
                const d = dirs.find((d) => d.dir === dir)!;
                console.log(d, dirs);
                return fetch(rura(`${d.dir}/photos.json`))
                    .then((x) => x.json())
                    .then((x: string[]) =>
                        Promise.resolve({
                            ...d,
                            items: x.map((i) => ({
                                thumb: rura(`${d.dir}/thumb/${i}`),
                                big: rura(`${d.dir}/big/${i}`),
                                full: rura(`${d.dir}/full/${i}`)
                            }))
                        })
                    );
            })
            .then(setDirectory);
    }, [dir]);

    return (
        <>
            <Head>
                <title>Zdjęcia</title>
            </Head>
            <div className="flex p-4 flex-col items-center">
                <div className="p-4 mb-4 text-white bg-gray-700 rounded-md">
                    <strong>INFO: </strong>Każde zdjęcie można pobrać w wysokiej rozdzielczości za pomocą odpowiedniego
                    przycisku.
                </div>

                {directory && <Photos directory={directory} />}
            </div>
        </>
    );
}

export default Zdjecia;
