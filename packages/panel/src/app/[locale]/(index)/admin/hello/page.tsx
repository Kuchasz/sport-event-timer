import { authenticate } from "src/auth";
import { Hello } from "./hello";

export default async function () {
    await authenticate();
    return <Hello />;
}
