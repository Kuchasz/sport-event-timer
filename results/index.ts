import next from "next";
import { Express } from "express";
import { resolve } from "path";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: dev ? resolve(__dirname) : resolve(__dirname + "../") });
const handle = app.getRequestHandler();

export const apply = async (server: Express): Promise<void> => {
    app.prepare().then(() => {
        server.all("*", (req, res) => {
            return handle(req, res);
        });
    });
};
