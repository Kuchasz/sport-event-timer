import { authenticate } from "src/auth";
import { Tools } from "./tools";
import { StandardPage } from "src/components/pages";

export default async function () {
    await authenticate();
    return (
        <StandardPage>
            <Tools />
        </StandardPage>
    );
}
