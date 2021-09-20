import express from "express";
import { apply as applyHub } from "@set/hub";
import { apply as applyResults } from "@set/results";
import { createServer } from "http";
import { resolve } from "path";

const requireModule = (path: string) => resolve(__dirname + `/../node_modules/${path}`);

const app = express();
const server = createServer(app);

const run = async () => {
    // app.get("/", (_, res) => {
    //     res.send("<h1>Hello world</h1>");
    // });

    app.use("/timer", express.static(requireModule("@set/mobile")));

    await applyHub(server);
    await applyResults(app);

    server.listen(21822, "localhost", () => {
        console.log("SERVER_STARTED_LISTENING");
    });
};

run();
