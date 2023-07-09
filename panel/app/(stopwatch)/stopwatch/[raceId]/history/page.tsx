import { authenticate } from "auth";
import { History } from "./history";

export default async function () {
    await authenticate();
    return <History />;
}
