import { authenticate } from "src/auth";
import { Tools } from "./tools";

export default async function () {
    await authenticate();
    return <Tools />;
}
