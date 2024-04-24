import { authenticate } from "src/auth";
import { Classifications } from "./classifications";
import { StandardPage } from "src/components/pages";

export default async function () {
    await authenticate();
    return (
        <StandardPage>
            <Classifications />
        </StandardPage>
    );
}
