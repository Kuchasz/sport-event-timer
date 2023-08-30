import { authenticate } from "auth";
import { Settings } from "./settings";

export default async function () {
    await authenticate();
    return <Settings/>
};