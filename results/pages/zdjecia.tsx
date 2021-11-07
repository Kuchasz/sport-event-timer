import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";

const DynamicPhotosComponent = dynamic(() => import("../components/photos"), { ssr: false });

type Item = {
    thumb: string;
    big: string;
    full: string;
};

type Directory = {
    dir: string;
    title: string;
    description: string;
    items: Item[];
};

const rura = (url: string) => `https://wedding-galleries.azurewebsites.net/rura/${url}`;

function Zdjecia() {
    const [directories, setDirectories] = useState<Directory[]>([]);
    useEffect(() => {
        fetch(rura("index.json"))
            .then((x) => x.json())
            .then((dirs: Directory[]) =>
                Promise.all(
                    dirs.map((d) =>
                        fetch(rura(`${d.dir}/photos.json`))
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
                            )
                    )
                )
            )
            .then(setDirectories);
    }, []);

    return (
        <>
            <Head>
                <title>Zdjęcia</title>
            </Head>
            <div className="flex p-4 flex-col items-center">
                <div className="p-4 text-white bg-gray-700 rounded-md">
                    <strong>INFO: </strong>Każde zdjęcie można pobrać w wysokiej rozdzielczości za pomocą odpowiedniego
                    przycisku.
                </div>
                {directories.length !== 0
                    ? directories.map((d) => <DynamicPhotosComponent key={d.dir} directory={d} />)
                    : null}
            </div>
        </>
    );
}

export default Zdjecia;
