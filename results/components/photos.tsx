import { SRLWrapper } from "simple-react-lightbox";

type Item = {
    thumb: string;
    big: string;
    full: string;
};

type Props = {
    directory: { dir: string; title: string; description: string; items: Item[] };
};

const options = {
    thumbnails: {
        showThumbnails: false
    }
};

const Photos = ({ directory }: Props) => {
    return (
        <div className="flex p-4 flex-col items-center">
            <h1 className="text-4xl text-center font-bold my-10">{directory.title}</h1>
            <h2 className="text-xl text-center text-zinc-500 mb-10">{directory.description}</h2>
            <SRLWrapper options={options}>
                <div className="w-100 flex flex-wrap justify-center">
                    {directory.items.map((i) => (
                        <a
                            className="gallery-item block hover:opacity-50 h-24 w-24 md:h-48 md:w-48 cursor-pointer m-1 md:m-3"
                            data-download-url={i.full}
                            href={i.big}
                            key={i.big}
                        >
                            <img
                                className="img-responsive border rounded-md w-full h-full object-cover"
                                src={i.thumb}
                                loading="lazy"
                            />
                        </a>
                    ))}
                </div>
            </SRLWrapper>
        </div>
    );
};

export default Photos;
