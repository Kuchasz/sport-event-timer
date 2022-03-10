import Head from "next/head";
import Photos from "../components/photos";
import { useEffect, useState } from "react";

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
    console.log("zdjecia.render");

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
                <div className="p-4 mb-4 text-white bg-gray-700 rounded-md">
                    <strong>INFO: </strong>Każde zdjęcie można pobrać w wysokiej rozdzielczości za pomocą odpowiedniego
                    przycisku.
                </div>

                {/* {directories.length !== 0 ? directories.map((d) => <Photos key={d.dir} directory={d} />) : null} */}
                <div className="flex flex-wrap">
                    {directories.length !== 0
                        ? directories.map((d) => (
                              <div className="relative min-w-96 flex-grow h-96">
                                  <img
                                      className="absolute z-[-10] top-0 w-full h-full object-center object-cover"
                                      src={d.items[0].big}
                                  />
                                  <div className="absolute z-[-9] top-0 w-full h-full bg-black opacity-50"></div>
                                  <div className="text-white font-semibold h-full flex flex-col justify-between p-4">
                                      <div className="flex flex-col">
                                          <span>{d.date}</span>
                                          <span>fot. {d.author}</span>
                                      </div>
                                      <div className="text-3xl">{d.title}</div>
                                  </div>
                              </div>
                          ))
                        : null}
                </div>
            </div>
        </>
    );
}

export default Zdjecia;
