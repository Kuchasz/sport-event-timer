import lgAutoplay from "lightgallery/plugins/autoplay";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import LightGallery from "lightgallery/react";

type Item = {
    thumb: string;
    big: string;
    full: string;
};

type Props = {
    directory: { dir: string; title: string; description: string; items: Item[] };
};

const Photos = ({ directory }: Props) => {
    return (
        <div className="flex p-4 flex-col items-center">
            <h1 className="text-6xl font-bold mt-20 mb-10">{directory.title}</h1>
            <h2 className="text-2xl text-gray-500 font-light mb-10">{directory.description}</h2>
            <LightGallery
                elementClassNames="flex flex-wrap justify-center"
                thumbnail={true}
                fullScreen={true}
                animateThumb={true}
                zoomFromOrigin={true}
                autoplay={true}
                autoplayControls={true}
                speed={500}
                mode={"lg-slide"}
                mobileSettings={{
                    controls: false,
                    showCloseIcon: true,
                    download: true
                }}
                plugins={[lgThumbnail, lgZoom, lgAutoplay, lgFullscreen]}
            >
                {directory.items.map((i) => (
                    <a
                        className="gallery-item block hover:opacity-50 drop-shadow-w-2xl h-24 w-24 cursor-pointer m-3"
                        data-download-url={i.full}
                        data-src={i.big}
                        data-thumb={i.thumb}
                        key={i.big}
                    >
                        <img
                            className="img-responsive rounded w-full h-full object-cover"
                            src={i.thumb}
                            loading="lazy"
                        />
                    </a>
                ))}
            </LightGallery>
        </div>
    );
};

export default Photos;
