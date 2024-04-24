import { authenticate } from "src/auth";
import { Penalties } from "./penalties";
import { StandardPage } from "src/components/pages";

export default async function () {
    await authenticate();
    return (
        <StandardPage>
            <Penalties />
        </StandardPage>
    );
}
