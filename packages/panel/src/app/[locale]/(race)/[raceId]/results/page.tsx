import { authenticate } from "src/auth";
import { Results } from "./results";
import { StandardPage } from "src/components/pages";

export default async function () {
    await authenticate();
    return (
        <StandardPage>
            <Results />
        </StandardPage>
    );
}
