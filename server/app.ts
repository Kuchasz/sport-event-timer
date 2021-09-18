import express from "express";
import { apply as applyHub } from "@set/hub";
import { apply as applyResults } from "@set/results";
import { createServer } from "http";

const app = express();
const server = createServer(app);

const run = async () => {
    // app.get("/", (_, res) => {
    //     res.send("<h1>Hello world</h1>");
    // });

    await applyHub(server);
    await applyResults(app);

    server.listen(21822, "localhost", () => {
        console.log("SERVER_STARTED_LISTENING");
    });
};

run();
