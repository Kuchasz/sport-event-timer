import { authenticate } from "auth";
import { Penalties } from "./penalties";

export default async function () {
    await authenticate();
    return <Penalties />;
}
