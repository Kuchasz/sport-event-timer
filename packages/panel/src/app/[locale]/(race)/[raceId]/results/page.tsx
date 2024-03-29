import { authenticate } from "src/auth";
import { Results } from "./results";

export default async function () {
    await authenticate();
    return <Results />;
}
