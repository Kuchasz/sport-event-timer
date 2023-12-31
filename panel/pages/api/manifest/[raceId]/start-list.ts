import type { NextApiRequest, NextApiResponse } from "next";

export default function (req: NextApiRequest, res: NextApiResponse) {
    const { raceId } = req.query;

    const manifest = {
        name: "Start List",
        short_name: "Start List",
        icons: [
            {
                src: "/favicon/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/favicon/icon-256x256.png",
                sizes: "256x256",
                type: "image/png",
            },
            {
                src: "/favicon/icon-384x384.png",
                sizes: "384x384",
                type: "image/png",
            },
            {
                src: "/favicon/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
        theme_color: "#fbbf24",
        background_color: "#fbbf24",
        display: "standalone",
        start_url: `/tools/${raceId}/start-list#next`,
    };

    res.status(200).json(manifest);
}
