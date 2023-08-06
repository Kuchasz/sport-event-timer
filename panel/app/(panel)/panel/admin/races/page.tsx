import { authenticate } from "auth";
import { Races } from "./races";

export default async function () {
    await authenticate();
    return <Races />;
}