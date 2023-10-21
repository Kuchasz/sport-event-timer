import { authenticate } from "auth";
import { Classifications } from "./classifications";

export default async function () {
    await authenticate();
    return <Classifications />;
}
