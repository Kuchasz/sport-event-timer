import { authenticate } from "auth";
import { Config } from "./config";

export default async function () {
    await authenticate();
    return <Config />;
}
