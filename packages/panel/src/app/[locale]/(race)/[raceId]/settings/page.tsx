import { authenticate } from "src/auth";
import { Settings } from "./settings";

export default async function () {
    await authenticate();
    return <Settings />;
}
